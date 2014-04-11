/**
 * @fileOverview
 * @ignore
 */define("bui/extensions/search",["bui/common","bui/form"],function(e){function r(e){r.superclass.constructor.call(this,e)}var t=e("bui/common"),n=e("bui/form");return t.extend(r,t.Base),r.ATTRS={tpl:{value:'<p><input type="text" name="key"/> <button class="button button-small">\u786e\u5b9a</button></p>'}},t.augment(r,{createDom:function(e){var t=this,r=$("<div></div>").append(t.get("tpl")),i=(new n.Group({srcNode:r})).render();t.set("el",r),t.set("group",i)},renderUI:function(e){var t=e.get("el");t.before(this.get("el"))},bindUI:function(e){var t=this,n=t.get("el"),r=e.get("store"),i=t.get("group");n.find(".button").on("click",function(e){r.load(i.getRecord())})}}),r});
