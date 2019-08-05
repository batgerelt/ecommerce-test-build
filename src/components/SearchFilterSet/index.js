/* eslint-disable react/no-multi-comp */
/* eslint-disable brace-style */
/* eslint-disable radix */
import React from "react";
// import { Collapse } from "react-collapse";
import { Slider, Collapse, Icon } from "antd";
import moment from "moment";
import Checkbox from "@material-ui/core/Checkbox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";

const formatter = new Intl.NumberFormat("en-US");

class FilterSet extends React.Component {
  render() {
    return <Content {...this.props} />;
  }
}

class Content extends React.Component {
  renderAttribute = () => {
    try {
      const { attrvalue, attrall, aggregations } = this.props;

      return aggregations.attributes.groups.buckets.map((attribute, index) => {
        let attname = attrall.find(i => i.id === attribute.key).name;

        if (attribute.doc_count >= this.props.total) {
          return (
            <Collapse.Panel header={attname} key={index}>
              <div className="collapse show">
                <div className="collapse-content">
                  <ul className="list-unstyled">
                    {
                        attribute.values.buckets.map((attributeval, ind) => {
                          let attrvaluenm = attrvalue.find(value => value.id === attributeval.key).name;

                          return (
                            <li key={ind} style={{ display: 'flex' }}>
                              <Checkbox
                                key={ind}
                                onChange={e => this.props.handleChangeAttribute(e, attributeval.key, attribute.key)}
                                style={{ color: 'gray', width: 25, height: 25 }}
                                icon={<CheckBoxOutlineBlankIcon style={{ fontSize: 20 }} />}
                                checkedIcon={<CheckBoxIcon style={{ fontSize: 20 }} />}
                              />

                              <label style={{ marginLeft: 5, lineHeight: '28px' }}>{attrvaluenm}</label>
                            </li>
                          );
                        })
                      }
                  </ul>
                </div>
              </div>
            </Collapse.Panel>
          );
        }

        return null;
      });
    } catch (error) {
      // return console.log(error);
      return null;
    }
  };

  // Шүүлтүүр хэсгийн брендийн жагсаалт харуулах хэсэг
  renderFilterBrand = () => {
    try {
      const { aggregations, brandall } = this.props;

      if (aggregations.brands.buckets.buckets.length !== 0) {
        return (
          <Collapse.Panel header="Бренд" key="8">
            <div className="collapse show" id={moment()}>
              <div className="collapse-content">
                <ul className="list-unstyled">
                  {aggregations.brands.buckets.buckets.map((brand, index) => (
                    <li key={index} style={{ display: 'flex' }}>
                      <Checkbox
                        key={index}
                        onChange={e => this.props.handleChangeBrand(e, brand.key)}
                        style={{ color: 'gray', width: 25, height: 25 }}
                        icon={<CheckBoxOutlineBlankIcon style={{ fontSize: 20 }} />}
                        checkedIcon={<CheckBoxIcon style={{ fontSize: 20 }} />}
                      />

                      <label style={{ marginLeft: 5, lineHeight: '28px' }}>
                        {brandall.find(i => i.id === brand.key) === undefined ? null : brandall.find(i => i.id === brand.key).name}
                      </label>
                    </li>
                    ))}
                </ul>
              </div>
            </div>
          </Collapse.Panel>
        );
      }

      return null;
    } catch (error) {
      // return console.log('error: ', error);
      return null;
    }
  };

  // Шүүлтүүр хэсгийн өнгийн жагсаалт харуулах хэсэг
  renderFilterColor = () => {
    try {
      const { aggregations } = this.props;
      if (aggregations.colors.buckets.length !== 0) {
        return (
          <Collapse.Panel header={'Өнгө'} key="9">
            <div className="collapse show">
              <div className="collapse-content">
                <ul className="list-unstyled">
                  {aggregations.colors.buckets.map((color, index) => (
                    <Checkbox
                      key={index}
                      onChange={this.props.handleChangeColor}
                      value={color.key}
                      style={{ color: color.key, width: 25, height: 25 }}
                      icon={
                        <CheckBoxOutlineBlankIcon style={{ fontSize: 20 }} />
                        }
                      checkedIcon={<CheckBoxIcon style={{ fontSize: 20 }} />}
                    />
                    ))}
                </ul>
              </div>
            </div>
          </Collapse.Panel>
        );
      }

      return null;
    } catch (error) {
      // return console.log(error);
      return null;
    }
  };

  // Шүүлтүүр хэсгийн үнийг харуулах хэсэг
  renderFilterPrice = () => {
    try {
      const { aggregations } = this.props;
      const marks = {
        [aggregations.min_price.value]: {
          label: <strong>{formatter.format(aggregations.min_price.value)}₮</strong>,
        },
        [aggregations.max_price.value]: {
          label: <strong>{formatter.format(aggregations.max_price.value)}₮</strong>,
        },
      };

      return (
        <Collapse.Panel header={'Үнэ'} key="10">
          <Slider
            range
            min={aggregations.min_price.value}
            max={aggregations.max_price.value}
            marks={marks}
            onAfterChange={this.props.handleChangePrice}
            style={{ width: "90%" }}
            defaultValue={[
              aggregations.min_price.value,
              aggregations.max_price.value,
            ]}
          />
        </Collapse.Panel>
      );
    } catch (error) {
      // return console.log('error: ', error);
      return null;
    }
  };

  render() {
    return (
      <Collapse
        bordered={false}
        expandIconPosition={"right"}
        expandIcon={({ isActive }) => <Icon type="left" style={{ color: 'gray' }} rotate={isActive ? -90 : 0} />}
        defaultActiveKey={['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10']}
      >
        {this.renderAttribute()}
        {this.renderFilterBrand()}
        {this.renderFilterColor()}
        {this.renderFilterPrice()}
      </Collapse>
    );
  }
}

export default FilterSet;
