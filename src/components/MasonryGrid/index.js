import React, { PureComponent, PropTypes } from 'react';
import Masonry from 'react-masonry-component';
import Card from '../../components/Card';
import styles from './MasonryGrid.css';

const masonryOptions = {
  transitionDuration: 5,
};

/**
 * Masonry Grid.
 * @class MasonryGrid
 * @extends Component
 */
export default class MasonryGrid extends PureComponent {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    items: PropTypes.array,
    handleOnShowSharePopup: PropTypes.func,
  }

  static defaultProps = {
    items: [],
  }

  /**
   * RenderCards method.
   * @method renderCards
   * @returns {string} Markup for the component.
   */
  renderCards() {
    return this.props.items.map((card, key) =>
      <Card
        blocks={card.document.blocks}
        content={card.description}
        title={card.title}
        ctaLabel={card.document.ctaLabel}
        ctaLink={card.document.ctaLink}
        distance={card.distance}
        serviceTitle={card.service.name}
        serviceUrl={card.service.url}
        serviceLogo={card.service.images.logo}
        serviceDescription={card.service.description}
        category={card.service.category}
        image={card.images.landscape}
        key={key}
        id={card.id}
        handleOnShowSharePopup={this.props.handleOnShowSharePopup}
      />
    );
  }

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    return (
      <Masonry
        className={styles.masonWrapper} // default ''
        elementType={'div'} // default 'div'
        options={masonryOptions} // default {}
        disableImagesLoaded={false} // default false
        updateOnEachImageLoad={false}
        // default false and works only if disableImagesLoaded is false
      >
        {this.renderCards()}
      </Masonry>
    );
  }
}
