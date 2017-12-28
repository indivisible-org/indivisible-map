import React from 'react';
// import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
import TableCell from './TableCell';

class Table extends React.Component {
  render() {
    const { items } = this.props;
    return (
      <div id="events-list">
        {items.map((item) => {
          return <TableCell key={item.id} item={item} />;
        })}
      </div>
    );
  }
}

// const mapStateToProps = (state) => {
//   return {
//     events: state.eventState.events, // selectEvents(state.events, state.filters)
//     featuresHome: state.eventState.featuresHome,
//   };
// };

// EventsTable.propTypes = {
//   events: PropTypes.arrayOf(PropTypes.shape({
//     address1: PropTypes.string,
//     city: PropTypes.string,
//     latitude: PropTypes.number,
//     longitude: PropTypes.number,
//   })).isRequired,
// };

// EventsTable.propTypes = {
  // events: PropTypes.arrayOf(PropTypes.object).isRequired,
  // featuresHome: PropTypes.shape({
  //   type: PropTypes.string,
  //   features: PropTypes.arrayOf(PropTypes.object),
  // }).isRequired,
// };


export default Table;
