/**
 * Button component.
 * @module component/Button
 */

import React, { PropTypes } from 'react';
import ToggleButton from 'react-toggle-button';
import { Link } from 'react-router';
import { isFunction } from 'lodash';
import styles from './Button.css';

const types = {
  link: `${styles.link}`,
  toggle: `${styles.toggle}`,
};

const renderElement = (rest, classNames) => {
  const url = rest.url || '/';
  if ((rest.onClick && isFunction(rest.onClick) && !rest.url)) {
    switch (rest.type) {
      case 'toggle':
        return (
          <div className={rest.className}>
            <ToggleButton
              activeLabel={'aan'}
              thumbStyle={{
                height: '28px',
                width: '28px',
              }}
              thumbStyleHover={{
                height: '28px',
                width: '28px',
              }}
              trackStyle={{
                width: '65px',
              }}
              colors={{
                active: {
                  base: '#60cda2',
                  hover: '#60cda2',
                },
                inactive: {
                  base: '#f5f5f5',
                  hover: '#f5f5f5',
                },
              }}
              {...rest.styles}
              {...rest.colors}
              containerStyle={rest.innerStyle}
              value={rest.value || false}
              onToggle={() => rest.onClick()}
            />
          </div>
        );
      default:
        return (
          <button {...rest} className={classNames}>
            {rest.children}
          </button>
        );
    }
  }
  return (
    <Link {...rest} to={url} className={classNames}>
      {rest.children}
    </Link>
  );
};

/**
 * Button container.
 * @function Button
 * @returns {string} Markup of the Button component.
 */
const Button = ({ buttonType = false, responsive, ...rest }) => {
  let classNames = (rest.className) ?
  `btn btn-primary ${rest.className}` :
  'btn btn-primary';

  classNames = (buttonType) ? `${classNames} ${types[buttonType]}` : classNames;
  classNames = (!responsive) ? `${classNames} ${styles.notResponsiveButton}` :
    `${classNames} btn-block`;

  return renderElement(rest, classNames);
};

Button.propTypes = {
  buttonType: PropTypes.string,
  responsive: PropTypes.bool,
  block: PropTypes.bool,
};

export default Button;
