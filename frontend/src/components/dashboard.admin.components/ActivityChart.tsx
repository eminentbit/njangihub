import { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { useActivityTimeLine } from "../../hooks/useAdmin";

const ActivityChart = ({ groupId }: { groupId: string }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const { activityTimeline } = useActivityTimeLine(groupId);

  useEffect(() => {
    if (!chartRef.current) return;
    const chart = echarts.init(chartRef.current);

    // Aggregate activities per month for the last 6 months
    const now = new Date();
    const months = Array.from({ length: 6 }).map((_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
      return d;
    });

    const monthLabels = months.map((d) =>
      d.toLocaleString("default", { month: "short" })
    );

    const activityCounts = months.map((month) => {
      const monthNum = month.getMonth();
      const yearNum = month.getFullYear();
      return activityTimeline
        ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
          activityTimeline.filter((a: any) => {
            const date = new Date(a.createdAt);
            return (
              date.getMonth() === monthNum && date.getFullYear() === yearNum
            );
          }).length
        : 0;
    });

    chart.setOption({
      animation: false,
      xAxis: {
        type: "category",
        data: monthLabels,
      },
      yAxis: { type: "value" },
      series: [
        {
          data: activityCounts,
          type: "line",
          smooth: true,
        },
      ],
      tooltip: { trigger: "axis" },
    });

    const handleResize = () => chart.resize();
    window.addEventListener("resize", handleResize);
    return () => {
      chart.dispose();
      window.removeEventListener("resize", handleResize);
    };
  }, [activityTimeline]);

  return <div ref={chartRef} id="activity-chart" className="h-64 w-full" />;
};

export default ActivityChart;
