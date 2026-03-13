import React from 'react'
import "../../styles/overView.css"
import Stats from '../../components/Stats'
import userGroup from '../../assets/images/icons/userGroup.png'
import monthlyIncome from '../../assets/images/icons/monthly-income.png'
import visitors from '../../assets/images/icons/overviewTask.png'
import inactiveUser from '../../assets/images/icons/InactiveUser.png'
import outstandingAmt from '../../assets/images/icons/outstandingAmt .png'
import unpaidInvoice from '../../assets/images/icons/unpaidInvoice.svg'
import activeTickets from '../../assets/images/icons/activeTickets.svg'
import sessionDuration from '../../assets/images/icons/sessionDuration.png'
import UserIncomeGraph from '../../components/Overview/UserIncomeGraph'
import { BiCaretDown, BiCaretUp } from "react-icons/bi"
import { Select } from 'antd'
import { Margin, usePDF } from "react-to-pdf";
import html2canvas from 'html2canvas';
import useAxiosInstance from '../../lib/useAxiosInstance'
import { useQuery } from 'react-query'


const Overview = () => {
  const axiosInstance = useAxiosInstance();
  const user = JSON.parse(localStorage.getItem("users"));
  const { toPDF, targetRef } = usePDF({
    filename: "Overview.pdf",
    page: { margin: Margin.SMALL }
  });
  console.log("user",user)
  const handleDownloadImage = async (format) => {
    try {
      const element = targetRef.current;
      const canvas = await html2canvas(element);
      const data = canvas.toDataURL(`image/${format}`);
      const link = document.createElement("a");
      link.href = data;
      link.download = `Overview.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error capturing image:", error);
    }
  };

  const handleDownload = (selectedFormat) => {
    selectedFormat === "pdf" ? toPDF() : handleDownloadImage(selectedFormat);
  };

  // Fetch overview widgets 
  const fetchOverviewWidget = async () => {
    const response = await axiosInstance.get(
      `api/widget/admin/dashboard`
    );
    return response.data;
  };

  const overviewData = useQuery("dashboard-widgets", fetchOverviewWidget);

  return (
    <>

      <div className="overview-container overview-page">
        <div className='px-4 flex flex-row justify-between items-center'>
          {/* <PageHeading pageTitle="Overview" /> */}
          <h1 className='userName capitalize'>Hello  <span>{user?.firstName}</span></h1>
          <div className='flex pr-3'>
            <Select
              style={{ width: "158px" }}
              className='mb-2'
              placeholder='Export as'
              onChange={handleDownload}
            >
              <Select.Option value='pdf'>PDF</Select.Option>
              <Select.Option value='jpg'>JPG</Select.Option>
              <Select.Option value='png'>PNG</Select.Option>
            </Select>
          </div>
        </div>
        <div ref={targetRef}>
          <div className="grid grid-cols-12 gap-16 grid-parent overview-top mx-7 p-8">
            <div className="col-span-12 sm:col-span-4">
              <Stats
                icon={userGroup}
                stat={overviewData?.data?.data?.users?.totalUsers || 0}
                title="Total Users "
                // changeIcon={<BiCaretUp />}
                changeIcon={
                  overviewData?.data?.data?.users?.monthlyUserChangePercentage !== 0 ?
                    (overviewData?.data?.data?.users?.monthlyUserChangePercentage > 0 ?
                      <BiCaretUp style={{ color: "green" }} /> :
                      <BiCaretDown style={{ color: "red" }} />
                    ) : null
                }
                percent={overviewData?.data?.data?.users?.monthlyUserChangePercentage || 0}
              />
            </div>
            <div className="col-span-12 sm:col-span-4" >
              <Stats
                icon={monthlyIncome}
                stat={overviewData?.data?.data?.income?.monthlyIncome}
                title="Monthly Income"
                // changeIcon={<BiCaretUp />}
                changeIcon={
                  overviewData?.data?.data?.income?.monthlyIncomeChangePercentage !== 0 ?
                    (overviewData?.data?.data?.income?.monthlyIncomeChangePercentage > 0 ?
                      <BiCaretUp style={{ color: "green" }} /> :
                      <BiCaretDown style={{ color: "red" }} />
                    ) : null
                }
                percent={overviewData?.data?.data?.income?.monthlyIncomeChangePercentage || 0}
              />
            </div>
            <div className="col-span-12 sm:col-span-4 visitors text-center pr-0" >
              <Stats
                icon={visitors}
                stat={overviewData?.data?.data?.dashboardVisits || 0}
                title="Dashboard visits"
                stat1={overviewData?.data?.data?.appDownloads || 0}
                title1="App Downloads"
              />
            </div>
          </div>

          <div className="user-income-graph flex mx-7 justify-between">
            <div className='' style={{ width: "68%" }}>
              <UserIncomeGraph incomeData={overviewData?.data?.data?.incomeGeneratedByUsers} />
            </div>
            <div className='overview-user-section  p-5' style={{ width: "30%" }}>
                  <div className='flex flex-col mt-2 gap-14'>
                <Stats
                  icon={unpaidInvoice}
                  stat={overviewData?.data?.data?.unpaidInvoices || 0}
                  title="Unpaid Invoices"
                />
                <Stats
                  icon={outstandingAmt}
                  stat={overviewData?.data?.data?.outstandingAmount || 0}
                  title="Outstanding Amount "
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-16 grid-parent overview-top mx-7  px-8 py-6">
            <div className="col-span-12 sm:col-span-4">
              <Stats
                icon={inactiveUser}
                stat={overviewData?.data?.data?.inactiveUsers || 0}
                title="Inactive Users"
              />
            </div>
            <div className="col-span-12 sm:col-span-4" >
              <Stats
                icon={sessionDuration}
                stat={overviewData?.data?.data?.averageSessionDuration || 0}
                title="Average Session Duration"
              />
            </div>
            <div className="col-span-12 sm:col-span-4 active-ticket" >
              <Stats
                icon={activeTickets}
                stat={overviewData?.data?.data?.numberOfActiveTickets || 0}
                title="No. of active Ticket"
              // changeIcon={<BiUpArrowAlt />}
              // percent="2.5%"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Overview