import React, { useState } from "react";
import Chart from "react-apexcharts";
import { Select } from "antd";
import NoDataIcon from "../../assets/svg/no-data.svg";

const UserIncomeGraph = ({ incomeData }) => {
  const [selectedOption, setSelectedOption] = useState("weekly");

  const options = {
    chart: {
      type: "area",
      height: "auto"
    },
    grid: {
      line: {
        stroke: "lightgray",
        strokeWidth: 0.6,
        strokeDasharray: "5 5"
      }
    },
    crosshairs: {
      stroke: {
        color: "#7CC5F4",
        width: 1,
        dashArray: 3
      }
    },
    fill: {
      colors: ["#7CC5F4"],
      type: "gradient"
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return `₹ ${val}`;
      },
      background: {
        opacity: 0.5
      },
      padding: "5px"
    },
    stroke: {
      curve: "smooth",
      width: 3
    },
    tooltip: {
      x: {
        format: "dd/MM/yy"
      },
      y: {
        title: "Income",
        formatter: function (val) {
          return `: ₹ ${val}`;
        }
      }
    },
    xaxis: {
      type: "datetime",
      categories: [],
      labels: {
        style: {
          colors: "var(--stat-text)"
        }
      }
    },
    yaxis: {
      show: true,
      labels: {
        style: {
          colors: "var(--stat-text)"
        }
      }
    },
    toolbar: {
      show: false
    }
  };

  const formatData = (data) => {
    if (!data) {
      return [];
    }
    return data.map((item) => ({
      x: item.date,
      y: item.count
    }));
  };

  const dataToShow =
    selectedOption === "weekly"
      ? formatData(incomeData?.weekly)
      : formatData(incomeData[selectedOption]);

  return (
    <div className='overview-user-graph'>
      <div className='overview-user-section overview-section'>
        <div className='overview-heading flex flex-row justify-between items-center'>
          <h4 className='overview-text'>Total Income Generated</h4>
          <div className='flex'>
            <Select
              style={{ width: "120px" }}
              className='mb-2 overview-dropdown'
              placeholder='Select'
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
              onChange={(value) => setSelectedOption(value)}
              defaultValue={selectedOption}
            >
              <Select.Option value='weekly'>Weekly</Select.Option>
              <Select.Option value='monthly'>Monthly</Select.Option>
              <Select.Option value='quarterly'>Quarterly</Select.Option>
              <Select.Option value='halfYearly'>Half-Yearly</Select.Option>
              <Select.Option value='yearly'>Yearly</Select.Option>
            </Select>
          </div>
        </div>
        <div
          style={{
            height: "330px",
            padding: "10px 10px 20px 10px",
            marginTop: "10px"
          }}
        >
          {dataToShow.length === 0 ? (
            <div className='flex flex-col justify-center items-center no-data-icon'>
              <img src={NoDataIcon} alt='No data' />
              <span>No Data Available</span>
            </div>
          ) : (
            <Chart
              height='100%'
              options={{
                ...options,
                xaxis: {
                  ...options.xaxis,
                  categories: dataToShow.map((item) => item.x)
                }
              }}
              series={[
                { data: dataToShow.map((item) => item.y), name: "Income" }
              ]}
              type='area'
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default UserIncomeGraph;
