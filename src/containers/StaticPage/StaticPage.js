import React, { PropTypes } from 'react';
import Helmet from 'react-helmet';
import { Grid, Row, Col } from 'react-bootstrap';
import { Header } from '../../containers';
import { SideMenu, Footer } from '../../components';

const StaticPage = ({ title, id, children }) =>
  <div id={id}>
    <Helmet title={title} />
    <Header />
    <Grid>
      <Row>
        <Col sm={3}>
          <SideMenu />
        </Col>
        <Col sm={9} className="static-content">
          {children}
        </Col>
      </Row>
    </Grid>
    <Footer />
  </div>;

StaticPage.propTypes = {
  title: PropTypes.string.isRequired,
  id: PropTypes.string,
  children: PropTypes.arrayOf(PropTypes.any),
};

export default StaticPage;
