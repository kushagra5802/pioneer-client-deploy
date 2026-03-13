import React, { useState } from 'react';
import { Table, Pagination, Select, Skeleton, Empty } from 'antd';
import Column from 'antd/es/table/Column';
import { useQuery } from 'react-query';
import useAxiosInstance from '../../lib/useAxiosInstance';

const AuditLogsList = () => {
  const axiosInstance = useAxiosInstance();

  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);

  // FETCH AUDIT LOGS DATA
  const fetchAuditLogs = async () => {
    const response = await axiosInstance.get(`api/auditLog/getLogs?page=${currentPage}&limit=${limit}`);
    setTotal(response?.data?.totalpages || 0);
    return response;
  };

  const auditLogsQuery = useQuery(
    ['audit-logs-list', currentPage, limit],
    fetchAuditLogs,
    { refetchOnWindowFocus: false, retry: 1 }
  );

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setLimit(pageSize);
  };
  const pagination = {
    total: total * limit,
    pageSize: limit,
    current: currentPage,
    onChange: handlePageChange,
  };

  const isLoading = auditLogsQuery?.isFetching || auditLogsQuery?.isLoading;

  return (
    <>
      <div className="reports-table">
        <Table
          rowKey={(record) => record._id}
          dataSource={auditLogsQuery?.data?.data?.data || []}
          pagination={pagination}
          locale={{
            emptyText: isLoading ? (
              <div style={{ marginLeft: '20px', width: '95%' }}>
                <Skeleton
                  title={false}
                  active
                  paragraph={{
                    rows: 6,
                    width: ['100%', '100%', '100%', '100%', '100%', '100%'],
                  }}
                />
              </div>
            ) : (
              <Empty />
            ),
          }}
        >
          <Column title="User Name" dataIndex="userName" render={(text) => <span>{text || '-'}</span>} />
          <Column title="User Role" dataIndex="userRole" render={(text) => <span>{text || '-'}</span>} />
          <Column title="Action" dataIndex="action" render={(text) => <span>{text || '-'}</span>} />
          <Column title="Details" dataIndex="details" render={(text) => <span>{text || '-'}</span>} />
          <Column title="IP Address" dataIndex="ipAddress" render={(text) => <span>{text || 'Unknown'}</span>} />
          <Column
            title="Created At"
            dataIndex="createdAt"
            render={(text) => <span>{new Date(text).toLocaleString()}</span>}
          />
        </Table>

        <div className="report-pagination">
          <div>
            <Select
              value={limit.toString()}
              style={{ width: 56 }}
              onChange={(value) => {
                setLimit(parseInt(value));
                setCurrentPage(1);
              }}
              options={[
                { value: '10', label: '10' },
                { value: '20', label: '20' },
                { value: '50', label: '50' },
                { value: '100', label: '100' },
              ]}
            />
            <span className="px-4">Entries Per Page</span>
          </div>
          <div className="report-selection">
            {/* <Pagination {...pagination} className="pagination" /> */}
            <Pagination className="pagination" current={currentPage} pageSize={limit} total={pagination.total}
                                    onChange={(page, pageSize) => {
                                        setCurrentPage(page);
                                        setLimit(pageSize);
                                    }}
                                />
          </div>
        </div>
      </div>
    </>
  );
};

export default AuditLogsList;
