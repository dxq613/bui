(function () {
  
  if(BUI.loaderScript.getAttribute('data-auto-use') == 'false'){
    return;
  }
  BUI.use(['bui/common','bui/data','bui/list','bui/picker',
    'bui/menu','bui/toolbar','bui/progressbar','bui/cookie',
    'bui/form','bui/mask','bui/select','bui/tab',
    'bui/calendar','bui/overlay','bui/editor','bui/grid','bui/tree','bui/tooltip'
  ]);
})();

