function createTraverser (isArray, q) {
  'use strict';

  function TreeTraverser (rootname, depth, cb) {
    this.rootname = rootname;
    this.depth = depth;
    this.cb = cb;
  }
  TreeTraverser.prototype.destroy = function () {
    this.cb = null;
    this.depth = null;
    this.rootname = null;
  }
  TreeTraverser.prototype.go = function () {
    return this.doNode([this.rootname]);
  };
  TreeTraverser.prototype.doNode = function (patharry) {
    var res;
    if (!this.cb) {
      return;
    }
    if (!isArray(patharry)) {
      return;
    }
    if (patharry.length === this.depth+1) {
      res = this.cb(patharry);
      return q.isThenable(res) ? res : q(res);
    }
    res = this.fetchNodes(patharry);
    if (q.isThenable(res)) {
      return res.then(this.onNodesFetched.bind(this, patharry));
    }
    return this.onNodesFetched(patharry, res);
  };
  TreeTraverser.prototype.onNodesFetched = function (patharry, nodenames) {
    var ret;
    if (!isArray(nodenames)) {
      return q(null);
    }
    ret = q.all(nodenames.map(longerpathproducer.bind(this, patharry)));
    patharry = null;
    return ret;
  };
  function longerpathproducer (patharry, nodename) {
    return this.doNode(patharry.concat(nodename));
  }

  return TreeTraverser;
}

module.exports = createTraverser;

