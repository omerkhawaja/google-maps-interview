import React, { Component, PropTypes } from 'react';
import _ from 'lodash';


class DataTable extends Component {
  constructor(props) {
    super(props);
    this.renderHeaders = this.renderHeaders.bind(this);
    this.renderRows = this.renderRows.bind(this);
  }

  handleRowClick(handleClickFromProp, id) {
    if (id) {
      handleClickFromProp(id);
    }
  }

  renderHeaders() {
    const { headers = [] } = this.props;
    return headers.map(function(item) {
      return (
        <tr key={item}>
          <th>{item}</th>
        </tr>
      );
    });
  }

  renderRows() {
    const { data = [], handleRowClickFromProp } = this.props;
    const _this = this;
    if (_.size(data) === 0) {
      return <tr>Loading...</tr>;
    }
    return data.map(function(item, index) {
      const tdItems = item.map(function (innerItem, i, options) {
        return <td key={innerItem} onClick={_this.handleRowClick.bind(this, handleRowClickFromProp, options[2].id)}>{innerItem}</td>;
      })
      .filter(function(item) {
        if (item.key !== '[object Object]') { // TODO: Refactor this
          return item;
        }
      });
      return <tr key={index}>{tdItems}</tr>;
    });
  }
  
  render() {    
    return (
      <table>
        <thead>
          {this.renderHeaders()}
        </thead>
        <tbody>
          {this.renderRows()}
        </tbody>
      </table>
    );;
  }
}

DataTable.propTypes = {
  headers: PropTypes.array,
  data: PropTypes.array.isRequired,
  handleRowClickFromProp: PropTypes.func
};

export default DataTable;
