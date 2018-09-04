/**
 * Newsletter container.
 * @module containers/Newsletter/Newsletter
 */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import {
  Button,
} from '../../components';
import {
  Header,
} from '../../containers';
import { setWeeklyEnabled, getWeeklyEnabledStatus } from '../../actions';
import styles from './Newsletter.css';


/**
 * Newsletter container class.
 * @class Newsletter
 * @extends Component
 */
export class Newsletter extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    getWeeklyEnabledStatus: PropTypes.func.isRequired,
    setWeeklyEnabled: PropTypes.func.isRequired,
    newsLetter: PropTypes.object.isRequired,
    userSession: PropTypes.object.isRequired,
  }

  /**
   * constructor
   * @method constructor
   * @param {props} props object
   * @returns {void}
   */
  constructor(props) {
    super(props);
    this.handleToggle = this.handleToggle.bind(this);
  }

  /**
   * ComponentWillMount
   * @function componentWillMount
   * @returns {undefined}
   */
  componentDidMount() {
    const { userSession } = this.props;
    this.props.getWeeklyEnabledStatus(userSession.placeId);
  }

  /**
   * handleToggle
   * @method handleToggle
   * @param {value} value bool
   * @returns {void}
   */
  handleToggle() {
    const { newsLetter, userSession } = this.props;
    this.props.setWeeklyEnabled(userSession.placeId, !newsLetter.active);
  }

  /**
   * Render
   * @function render
   * @returns {string} JSX the rendered elements
   */
  render() {
    const { newsLetter } = this.props;
    return (
      <div id="page-newsletter-menu">
        <Helmet title="Buurtbericht beheren" />
        <Header />
        <div className="container">
          <h2 className={styles.heading}>Buurtbericht beheren</h2>
          <div className={`${styles.panel} panel panel-default`}>
            <ul className={styles.listGroup}>
              <li className={`${styles.listGroupItem} header`}>
                <Button
                  className="pull-right"
                  buttonType="toggle"
                  type="toggle"
                  onClick={this.handleToggle}
                  value={newsLetter.active}
                />
                <h2>Wekelijks een Buurtbericht per e-mail ontvangen</h2>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    userSession: state.userSession,
    newsLetter: state.newsLetter,
  }),
  {
    getWeeklyEnabledStatus,
    setWeeklyEnabled,
  }
)(Newsletter);
