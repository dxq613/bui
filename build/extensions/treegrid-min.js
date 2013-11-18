/*! BUI - v0.1.0 - 2013-11-18
* https://github.com/dxq613/bui
* Copyright (c) 2013 dxq613; Licensed MIT */
define("bui/extensions/treegrid",["bui/common","bui/grid","bui/tree"],function(a){"use strict";var b=a("bui/tree"),c=a("bui/grid"),d=c.Grid.extend([b.Mixin],{},{ATTRS:{iconContainer:{value:".bui-grid-cell-inner"}}},{xclass:"tree-grid"});return d});