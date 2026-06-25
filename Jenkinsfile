// njangihub CI/CD — runs on an ephemeral Kubernetes agent pod.
//
// Flow (on main): checkout -> build 2 images with kaniko -> push to Docker Hub
//                 -> kubectl set image + rollout on the njangihub namespace.
//
// The 3 background workers (email/db/cron) run the SAME backend image with a
// different start command, so only `backend` and `frontend` are built here.
//
// The agent pod has three purpose-built containers:
//   kaniko  : daemonless image build + push (no Docker socket needed)
//   kubectl : applies the rolling update, using the `jenkins` ServiceAccount
//             which is RBAC-bound to deploy into `njangihub`.
pipeline {
  agent {
    kubernetes {
      defaultContainer 'kubectl'
      yaml '''
apiVersion: v1
kind: Pod
spec:
  serviceAccountName: jenkins
  containers:
    # One kaniko container per image: kaniko mutates the container rootfs per
    # build and must run only once per container, so each image gets its own.
    # They share /kaniko/.docker (Docker Hub auth) via the docker-config volume.
    - name: kaniko-backend
      image: gcr.io/kaniko-project/executor:v1.23.2-debug
      command: ["/busybox/cat"]
      tty: true
      volumeMounts:
        - name: docker-config
          mountPath: /kaniko/.docker
      resources:
        requests: { cpu: "200m", memory: "512Mi" }
        limits:   { cpu: "1500m", memory: "2Gi" }
    - name: kaniko-frontend
      image: gcr.io/kaniko-project/executor:v1.23.2-debug
      command: ["/busybox/cat"]
      tty: true
      volumeMounts:
        - name: docker-config
          mountPath: /kaniko/.docker
      resources:
        requests: { cpu: "300m", memory: "512Mi" }
        limits:   { cpu: "1500m", memory: "3Gi" }
    - name: kubectl
      image: alpine/k8s:1.31.7
      command: ["sleep"]
      args: ["99d"]
      tty: true
      resources:
        requests: { cpu: "50m", memory: "64Mi" }
        limits:   { cpu: "300m", memory: "256Mi" }
  volumes:
    - name: docker-config
      emptyDir: {}
'''
    }
  }

  options {
    timeout(time: 40, unit: 'MINUTES')
    disableConcurrentBuilds()
    buildDiscarder(logRotator(numToKeepStr: '20'))
  }

  environment {
    REGISTRY = 'docker.io/ejohdaryl'
    NS       = 'njangihub'
  }

  stages {
    stage('Init') {
      steps {
        script {
          // Short git SHA as the immutable image tag (forces a real rollout).
          env.TAG = (env.GIT_COMMIT ?: '').take(7) ?: "build-${env.BUILD_NUMBER}"
          echo "Building tag=${env.TAG} -> ${env.REGISTRY}/njangihub-*"
        }
        container('kaniko-backend') {
          // Write Docker Hub auth where kaniko expects it (shared volume → all kaniko containers).
          withCredentials([usernamePassword(credentialsId: 'dockerhub',
                                             usernameVariable: 'DH_USER',
                                             passwordVariable: 'DH_PASS')]) {
            sh '''
              set -e
              mkdir -p /kaniko/.docker
              AUTH=$(printf '%s:%s' "$DH_USER" "$DH_PASS" | base64 | tr -d '\\n')
              cat > /kaniko/.docker/config.json <<EOF
{"auths":{"https://index.docker.io/v1/":{"auth":"$AUTH"}}}
EOF
            '''
          }
        }
      }
    }

    stage('Build & push backend') {
      steps {
        container('kaniko-backend') {
          sh '''
            /kaniko/executor \
              --context "$WORKSPACE/backend" \
              --dockerfile "$WORKSPACE/backend/Dockerfile" \
              --destination "$REGISTRY/njangihub-backend:$TAG" \
              --destination "$REGISTRY/njangihub-backend:latest"
          '''
        }
      }
    }

    stage('Build & push frontend') {
      steps {
        container('kaniko-frontend') {
          // Vite build-time vars come from the committed frontend/.env.production.
          sh '''
            /kaniko/executor \
              --context "$WORKSPACE/frontend" \
              --dockerfile "$WORKSPACE/frontend/Dockerfile" \
              --destination "$REGISTRY/njangihub-frontend:$TAG" \
              --destination "$REGISTRY/njangihub-frontend:latest"
          '''
        }
      }
    }

    stage('Deploy to DOKS') {
      steps {
        container('kubectl') {
          sh '''
            set -e
            # backend + the 3 workers all run the backend image.
            kubectl -n "$NS" set image deployment/backend      backend="$REGISTRY/njangihub-backend:$TAG"
            kubectl -n "$NS" set image deployment/email-worker  email-worker="$REGISTRY/njangihub-backend:$TAG"
            kubectl -n "$NS" set image deployment/db-worker     db-worker="$REGISTRY/njangihub-backend:$TAG"
            kubectl -n "$NS" set image deployment/cronjob       cronjob="$REGISTRY/njangihub-backend:$TAG"
            kubectl -n "$NS" set image deployment/frontend      frontend="$REGISTRY/njangihub-frontend:$TAG"

            kubectl -n "$NS" rollout status deployment/backend      --timeout=300s
            kubectl -n "$NS" rollout status deployment/email-worker --timeout=300s
            kubectl -n "$NS" rollout status deployment/db-worker    --timeout=300s
            kubectl -n "$NS" rollout status deployment/cronjob      --timeout=300s
            kubectl -n "$NS" rollout status deployment/frontend     --timeout=300s
          '''
        }
      }
    }
  }

  post {
    success { echo "✅ Deployed ${env.TAG} to ${env.NS}" }
    failure { echo "❌ Pipeline failed for ${env.TAG}" }
  }
}
