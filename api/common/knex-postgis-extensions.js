/* eslint no-underscore-dangle: "off" */

export default (knex, formatter) => ({
  setSRID(geom, srid) {
    return knex.raw('ST_SetSRID(?, ?)', [formatter.wrapWKT(geom), srid]);
  },
  distance(from, to) {
    return knex.raw('ST_Distance(?, ?)', [formatter.wrapWKT(from), formatter.wrapWKT(to)]);
  },
  makePoint(longitudeColumn, latitudeColumn) {
    return knex.raw('ST_MakePoint(cast(? as float),cast(? as float))', [
      formatter.wrapWKT(longitudeColumn), formatter.wrapWKT(latitudeColumn),
    ]);
  },
  distanceBetweenColumnAndGeoJson(sourceColumn, geoJson, asColumn) {
    // These links explain how to convert to the correct distance units.
    // http://gis.stackexchange.com/questions/133450/st-distance-values-in-kilometers
    // http://epsg.io/28992 transformation for NL
    const distance = knex.st.distance(
      formatter.wrapWKT(sourceColumn),
      knex.st._setDutchSRID(knex.st.geomFromGeoJSON(geoJson))
    );
    if (asColumn) {
      return distance.as(asColumn);
    }
    return distance;
  },
  dwithin(from, geoJson, distance) {
    return knex.raw('ST_DWithin(?, ?, ?)', [
      formatter.wrapWKT(from),
      knex.st._setDutchSRID(knex.st.geomFromGeoJSON(geoJson)),
      distance,
    ]);
  },
  dutchGeometryToGeoJSON(geometry) {
    return knex.st._asGeoJSON(knex.st.transform(geometry, 4326));
  },
  dutchGeometryFromGeoJSON(geojson) {
    return knex.st._setDutchSRID(knex.st.geomFromGeoJSON(geojson));
  },
  dutchMakePoint(longitudeColumn, latitudeColumn) {
    return knex.st._setDutchSRID(this.makePoint(longitudeColumn, latitudeColumn));
  },
  _setDutchSRID(geometry) {
    return knex.st.transform(knex.st.setSRID(geometry, 4326), 28992);
  },
  _asGeoJSON(geom) {
    return knex.raw('ST_asGeoJSON(?)', [geom]);
  },
});
