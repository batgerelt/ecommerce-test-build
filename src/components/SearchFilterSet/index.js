/* eslint-disable react/no-multi-comp */
/* eslint-disable brace-style */
/* eslint-disable radix */
import React from "react";
import { injectIntl } from 'react-intl';
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
      const { attrvalue, attrall, data } = this.props;
      const lang = localStorage.getItem('lang');

      return data.aggregations.attributes.groups.buckets.map((attribute, index) => {
        if (attribute.doc_count >= data.hits.total.value) {
          return (
            <Collapse.Panel header={lang === "mn" ? attrall.find(i => i.id === attribute.key).name : attrall.find(i => i.id === attribute.key).nameen} key={index}>
              <div className="collapse show">
                <div className="collapse-content">
                  <ul className="list-unstyled">
                    {
                        attribute.values.buckets.map((attributeval, ind) => (
                          <li key={ind} style={{ display: 'flex', height: '25px' }}>
                            <Checkbox
                              key={ind}
                              onChange={e => this.props.handleChangeAttribute(e, attributeval.key, attribute.key)}
                              style={{ color: 'gray', width: 25, height: 25 }}
                              icon={<CheckBoxOutlineBlankIcon style={{ fontSize: 20 }} />}
                              checkedIcon={<CheckBoxIcon style={{ fontSize: 20 }} />}
                            />
                            <label style={{ marginLeft: 5, lineHeight: '28px' }}>
                              {lang === "mn" ? attrvalue.find(value => value.id === attributeval.key).name : attrvalue.find(value => value.id === attributeval.key).nameen}
                            </label>
                          </li>
                          ))
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
      const { data, brandall, intl } = this.props;
      const lang = localStorage.getItem('lang');

      if (data.aggregations.brands.buckets.buckets.length !== 0) {
        return (
          <Collapse.Panel header={intl.formatMessage({ id: "search.filter.title.brand" })} key="8">
            <div className="collapse show" id={moment()}>
              <div className="collapse-content">
                <ul className="list-unstyled">
                  {data.aggregations.brands.buckets.buckets.map((brand, index) => (
                    <li key={index} style={{ display: 'flex', height: '25px' }}>
                      <Checkbox
                        key={index}
                        onChange={e => this.props.handleChangeBrand(e, brand.key)}
                        style={{ color: 'gray', width: 25, height: 25 }}
                        icon={<CheckBoxOutlineBlankIcon style={{ fontSize: 20 }} />}
                        checkedIcon={<CheckBoxIcon style={{ fontSize: 20 }} />}
                      />

                      <label style={{ marginLeft: 5, lineHeight: '28px' }}>
                        {lang === "mn" ? brandall.find(i => i.id === brand.key).name : brandall.find(i => i.id === brand.key).nameen}
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
      const { data, intl } = this.props;
      if (data.aggregations.colors.buckets.length !== 0) {
        return (
          <Collapse.Panel header={intl.formatMessage({ id: "search.filter.title.color" })} key="9">
            <div className="collapse show">
              <div className="collapse-content">
                <ul className="list-unstyled">
                  {data.aggregations.colors.buckets.map((color, index) => (
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
      const { data, intl } = this.props;
      const marks = {
        [data.aggregations.min_price.value]: {
          label: <strong>{formatter.format(data.aggregations.min_price.value)}₮</strong>,
        },
        [data.aggregations.max_price.value]: {
          label: <strong>{formatter.format(data.aggregations.max_price.value)}₮</strong>,
        },
      };

      return (
        <Collapse.Panel header={intl.formatMessage({ id: "search.filter.title.price" })} key="10">
          <Slider
            range
            min={data.aggregations.min_price.value}
            max={data.aggregations.max_price.value}
            marks={marks}
            onAfterChange={this.props.handleChangePrice}
            style={{ width: "90%" }}
            defaultValue={[
              data.aggregations.min_price.value,
              data.aggregations.max_price.value,
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

export default injectIntl(FilterSet);
