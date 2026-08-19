/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { Stores } from './pages/Stores';
import { Warranty } from './pages/Warranty';

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/stores" element={<Stores />} />
          <Route path="/warranty" element={<Warranty />} />
          <Route path="/bao-hanh" element={<Warranty />} />
        </Routes>
      </Layout>
    </Router>
  );
}
