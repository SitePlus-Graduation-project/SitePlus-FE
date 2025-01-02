import { useEffect, useState } from "react";
import * as React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const DashboardCharts: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const isDark = document.documentElement.classList.contains('dark');
          setTheme(isDark ? 'dark' : 'light');
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  // Define chart colors
  const chartColors = {
    blue: '#3B82F6',
    orange: '#F97316',
  };

  // Bar chart data
  const barData = {
    labels: ["Số lượng yêu cầu", "Khảo sát thành công"],
    datasets: [
      {
        label: "Số lượng",
        data: [650, 520],
        backgroundColor: [chartColors.orange, chartColors.blue],
        barThickness: 20,
      },
    ],
  };

  const barOptions: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)',
        titleColor: theme === 'dark' ? '#000' : '#fff',
        bodyColor: theme === 'dark' ? '#000' : '#fff',
        padding: 12,
        cornerRadius: 4,
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: theme === 'dark' ? '#fff' : '#000',
          font: {
            size: 12,
            weight: 500,
          },
        },
        border: {
          display: false,
        }
      },
      y: {
        beginAtZero: true,
        border: {
          display: false,
        },
        ticks: {
          color: theme === 'dark' ? '#fff' : '#000',
          font: {
            size: 12,
          },
        },
        grid: {
          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          lineWidth: 1,
        },
      },
    },
  };

  return (
    <div className="min-w-0 flex-1"> {/* Thêm min-w-0 và flex-1 */}
      <div className="w-full bg-background border border-border rounded-lg p-6 shadow-md overflow-hidden"> {/* Thêm overflow-hidden */}
        <h3 className="text-lg font-semibold mb-6 text-foreground">
          Số lượng yêu cầu và khảo sát thành công
        </h3>
        <div className="w-full" style={{ height: "400px", minWidth: 0 }}> {/* Đặt minWidth: 0 */}
          <Bar 
            data={barData} 
            options={{
              ...barOptions,
              maintainAspectRatio: false,
              responsive: true,
            }} 
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;