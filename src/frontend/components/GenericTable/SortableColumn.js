import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faMinus, faChevronUp, faChevronDown} from '@fortawesome/free-solid-svg-icons';

class SortableColumn extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        return (
            <th scope="col" onClick={this.props.sort}>
                <div className="row">
                    <p>{this.props.name}</p>
                    <div className="column justify-content-center">
                        <FontAwesomeIcon icon={this.props.current === this.props.value ? this.props.asc ? faChevronUp : faChevronDown : faMinus}/>
                    </div>
                </div>
          </th>
        );
    }
}

SortableColumn.defaultProps = {
    name: '',       // Name of the column
    value: '',      // Value of the column
    current: '',    // Current column being sorted by
    asc: false,     // Current column ascending
    sort: () => {}  // Function to sort rows by this column
};

export default SortableColumn;
