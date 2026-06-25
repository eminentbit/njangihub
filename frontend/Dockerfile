# Stage 1: Builder (Node.js for building the frontend)
FROM node:23-alpine AS builder

WORKDIR /app

# Copy only package.json and package-lock.json for efficient caching
COPY package*.json ./

# Install all dependencies (including devDependencies)
RUN npm ci

# Copy the rest of the application code
COPY . .

# Public, build-time API config baked into the static bundle by Vite.
# These live here because frontend/.env.production is gitignored (.env.*), so
# kaniko (which builds from the git clone) never sees a .env file. Vite inlines
# any VITE_-prefixed process env var at build time.
ENV VITE_API_URL=https://njangihub.loop-os.org/api \
    VITE_VALIDATE_API_URL=https://njangihub.loop-os.org/api \
    VITE_SOCKET_SERVER_URL=https://njangihub.loop-os.org \
    VITE_CREATE_NJANGI_API_URL=/create-njangi \
    VITE_ACCEPT_INVITE_MEMBER_API_URL=/member/accept-member-invite \
    VITE_VALIDATE_DRAFTID_API_URL=/admin/validate-draft-id \
    VITE_VALIDATE_INVITE_TOKEN_API_URL=/invites/validate-invite-token \
    VITE_LOGIN_API_URL=/auth/login \
    VITE_NJANGI_OVERVIEW_API_URL=/state-dashboard/admin/my-njangi-overview \
    VITE_NJANGIS_API_URL=/state-dashboard/admin/my-njangis \
    VITE_NJANGIS_DETAILS_API_URL=/state-dashboard/admin/my-njangi-details \
    VITE_NJANGIS_STATUS_API_URL=/state-dashboard/admin/my-njangi-status \
    VITE_UPDATE_STATE_DASHBOARD_NJANGI=/state-dashboard/update-njangi-details \
    VITE_DELETE_STATE_DASHBOARD_NJANGI=/state-dashboard/cancel-njangi-details

# Build the application (assuming 'npm run build' creates a 'dist' folder)
RUN npm run build

# Stage 2: Production (Nginx for serving static content)
FROM nginx:stable-alpine
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/dist /usr/share/nginx/html
COPY conf/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]