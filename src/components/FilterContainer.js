import React from "react";
import { Row, Col, Select, Button, Checkbox} from "antd";

const onChange = (checkedValues) => {
  console.log("checked = ", checkedValues);
};

const FilterContainer = ({isSearch, setIsSearchOpen}) => {
  return (
    <div className="filter-container">
      <div className="flex justify-between filter-header">
        <p>Filter By</p>
        <p>Reset Filters</p>
      </div>

      <div className="filter-container-body">
        <div className="mb2">
          <Col span={8}>
            <label htmlFor="">Category</label>
            <br></br>

            <Select
              defaultValue="All"
              // size='large'
              style={{
                width: 290,
                height: "30px !important",
                marginTop: "10px",
              }}
              //   onChange={handleChange}
              options={[
                {
                  value: "Infrastructure",
                  label: "Infrastructure",
                },
                {
                  value: "Health",
                  label: "Health",
                },
              ]}
            />
          </Col>
        </div>

        <div className="mt3 mb3 ml1">
          <label htmlFor="">Priority</label>
          <br></br>

          <Checkbox.Group
            style={{
              width: "100%",
            }}
            onChange={onChange}
          >
            <Row className="priority-option mt1">
              <Col className="mr3">
                <Checkbox value="low">Low</Checkbox>
              </Col>
              <Col className="mr3">
                <Checkbox value="medium">Medium</Checkbox>
              </Col>
              <Col className="mr3">
                <Checkbox value="high">High</Checkbox>
              </Col>
            </Row>
          </Checkbox.Group>
        </div>

        <div className="mt3 mb3">
          <Col span={8}>
            <label htmlFor="">Status</label>
            <br></br>

            <Select
              defaultValue="All"
              // size='large'
              style={{
                width: 290,
                height: "30px !important",
                marginTop: "10px",
              }}
              //   onChange={handleChange}
              options={[
                {
                  value: "completed",
                  label: "Completed",
                },
                {
                  value: "in-progress",
                  label: "In progess",
                },
              ]}
            />
          </Col>
        </div>
      </div>

      <div className="filter-container-footer flex justify-end ">
        <Button className="mr2 cnl-btn">Cancel</Button>
        <Button className="mr2 upt-btn">Update</Button>
      </div>
    </div>
  );
};

export default FilterContainer;
