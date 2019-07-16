import React from 'react';
import { Link } from 'react-router-dom';
import { Exception } from '../../components';

export default () => (
  <Exception type="404" style={{ display: 'flex', justifyContent: "center", padding: '11%' }} linkElement={Link} />
);
