'use strict';

module.exports = function(grunt) {
  grunt.file.defaultEncoding = 'utf8';
  var path = require('path');
  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    clean: {
      files: ['build']
    },
    concat: {
      js : {
        options: {
          banner: '<%= banner %>',
          stripBanners: true
        },
        files: [
          {
            "build/common.js":[
              "src/common/common.js",
              "src/common/util.js",
              "src/common/array.js",
              "src/common/observable.js",
              "src/common/ua.js",
              "src/common/json.js",
              "src/common/keycode.js",
              "src/common/date.js",
              "src/common/base.js",
              "src/common/component.js",
              "src/common/component/manage.js",
              "src/common/component/uibase.js",
              "src/common/component/uibase/base.js",
              "src/common/component/uibase/align.js",
              "src/common/component/uibase/autoshow.js",
              "src/common/component/uibase/autohide.js",
              "src/common/component/uibase/close.js",
              "src/common/component/uibase/drag.js",
              "src/common/component/uibase/keynav.js",
              "src/common/component/uibase/mask.js",
              "src/common/component/uibase/position.js",
              "src/common/component/uibase/listitem.js",
              "src/common/component/uibase/stdmod.js",
              "src/common/component/uibase/decorate.js",
              "src/common/component/uibase/tpl.js", 
              "src/common/component/uibase/collapseable.js", 
              "src/common/component/uibase/selection.js", 
              "src/common/component/uibase/list.js", 
              "src/common/component/uibase/childcfg.js", 
              "src/common/component/uibase/depends.js", 
              "src/common/component/uibase/bindable.js", 
              "src/common/component/view.js",
              "src/common/component/controller.js"
            ]
          },
          {
            "build/toolbar.js":[
              "src/bar/base.js",
              "src/bar/baritem.js",
              "src/bar/bar.js",
              "src/bar/pagingbar.js",
              "src/bar/numberpagingbar.js",
            ]
          },
          {
            "build/calendar.js":[
              "src/calendar/base.js",
              "src/calendar/monthpicker.js",
              "src/calendar/header.js",
              "src/calendar/panel.js",
              "src/calendar/calendar.js",
              "src/calendar/datepicker.js",
            ]
          },
          {
            "build/cookie.js":[
              "src/cookie/cookie.js"
            ]
          },
          {
            "build/data.js":[
              "src/data/base.js",
              "src/data/sortable.js",
              "src/data/proxy.js",
              "src/data/abstractstore.js",
              "src/data/node.js",
              "src/data/treestore.js",
              "src/data/store.js",
            ]
          },
          {
            "build/editor.js":[
              "src/editor/base.js",
              "src/editor/mixin.js",
              "src/editor/editor.js",
              "src/editor/record.js",
              "src/editor/dialog.js",
            ]
          },
          {
            "build/form.js":[
              "src/form/base.js",
              "src/form/tips.js",
              "src/form/field/base.js",
              "src/form/field/text.js",
              "src/form/field/number.js",
              "src/form/field/hidden.js",
              "src/form/field/readonly.js",
              "src/form/field/select.js",
              "src/form/field/date.js",
              "src/form/field/check.js",
              "src/form/field/checkbox.js",
              "src/form/field/radio.js",
              "src/form/field/plain.js",
              "src/form/field.js",
              "src/form/valid.js",
              "src/form/groupvalid.js",
              "src/form/fieldcontainer.js",
              "src/form/group/base.js",
              "src/form/group/range.js",
              "src/form/group/check.js",
              "src/form/group/select.js",
              "src/form/fieldgroup.js",
              "src/form/form.js",
              "src/form/hform.js",
              "src/form/row.js",
              "src/form/rule.js",
              "src/form/rules.js",
              "src/form/remote.js",
            ]
          },
          {
            "build/grid.js":[
              "src/grid/base.js",
              "src/grid/simplegrid.js",
              "src/grid/column.js",
              "src/grid/header.js",
              "src/grid/grid.js",
              "src/grid/util.js",
              "src/grid/plugins/base.js",
              "src/grid/plugins/gridmenu.js",
              "src/grid/plugins/cascade.js",
              "src/grid/plugins/selection.js",
              "src/grid/plugins/summary.js",
              "src/grid/plugins/editing.js",
              "src/grid/plugins/cellediting.js",
              "src/grid/plugins/rowediting.js",
              "src/grid/plugins/dialog.js",
            ]
          },
          {
            "build/list.js":[
              "src/list/base.js",
              "src/list/domlist.js",
              "src/list/keynav.js",
              "src/list/simplelist.js",
              "src/list/listbox.js",
              "src/list/listitem.js",
              "src/list/list.js",
            ]
          },
          {
            "build/loader.js":[
              "src/loader/sea.js",
              "src/loader/seajs-cfg.js",
            ]
          },
          {
            "build/mask.js":[
              "src/mask/base.js",
              "src/mask/mask.js",
              "src/mask/loadMask.js",
            ]
          },
          {
            "build/menu.js":[
              "src/menu/base.js",
              "src/menu/menuitem.js",
              "src/menu/menu.js",
              "src/menu/popmenu.js",
              "src/menu/contextmenu.js",
              "src/menu/sidemenu.js",
            ]
          },
          {
            "build/overlay.js":[
              "src/overlaybase.js",
              "src/overlayoverlay.js",
              "src/overlaydialog.js",
              "src/overlaymessage.js",
            ]
          },
          {
            "build/picker.js":[
              "src/picker/base.js",
              "src/picker/picker.js",
              "src/picker/listpicker.js",
            ]
          },
          {
            "build/progressbar.js":[
              "src/progressbar/base.js",
              "src/progressbar/progressbar.js",
              "src/progressbar/loadprogressbar.js",
            ]
          },
          {
            "build/select.js":[
              "src/select/base.js",
              "src/select/select.js",
              "src/select/combox.js",
              "src/select/suggest.js",
            ]
          },
          {
            "build/tab.js":[
              "src/tab/base.js",
              "src/tab/navtabitem.js",
              "src/tab/navtab.js",
              "src/tab/tabitem.js",
              "src/tab/tab.js",
              "src/tab/tabpanelitem.js",
              "src/tab/tabpanel.js",
            ]
          },
          {
            "build/tooltip.js":[
              "src/tooltip/base.js",
              "src/tooltip/tip.js",
              "src/tooltip/tips.js",
            ]
          },
          {
            "build/tree.js":[
              "src/tree/base.js",
              "src/tree/treemixin.js",
              "src/tree/treelist.js",
            ]
          },
          {
            "build/slider.js":[
              "src/slider/base.js",
              "src/slider/slider.js",
            ]
          },
          {
            "build/swf.js":[
              "src/swf/src/swf/ua.js",
              "src/swf/src/swf.js",
            ]
          },
          {
            "build/uploader.js":[
              "src/uploader/button/ajbridge.js",
              "src/uploader/button/base.js",
              "src/uploader/button/htmlButton.js",
              "src/uploader/button/swfButton.js",
              "src/uploader/type/base.js",
              "src/uploader/type/ajax.js",
              "src/uploader/type/flash.js",
              "src/uploader/queue.js",
              "src/uploader/theme.js",
              "src/uploader/factory.js",
              "src/uploader/uploader.js",
              "src/uploader/base.js",
            ]
          },
        ],
      },
      bui : {
        options: {
          banner: '<%= banner %>',
          stripBanners: true
        },
        files: [
          {
            "build/bui.js" : [
              "build/loader.js",
              "build/common.js",
              "build/cookie.js",
              "build/data.js",
              "build/overlay.js",
              "build/list.js",
              "build/picker.js",
              "build/form.js",
              "build/select.js",
              "build/mask.js",
              "build/menu.js",
              "build/tab.js",
              "build/toolbar.js",
              "build/progressbar.js",
              "build/calendar.js",
              "build/editor.js",
              "build/grid.js",
              "build/tree.js",
              "build/tooltip.js",
              "src/all.js"
            ]
          }
        ]
      },
      seed : {
        options: {
          banner: '<%= banner %>',
          stripBanners: true
        },
        files: [
          {
            "build/seed.js" : [
              "build/loader.js",
              "build/common.js",
              "build/cookie.js",
              "src/seed.js"
            ]
          }
        ]
      }
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        files: [
          { expand: true, cwd: './build', src: ['./**/*.js'], dest: 'build', rename: function(destBase, destPath, options){
            return path.join(destBase || '', destPath.replace(/\.js/gi, "-min.js"));
          } }
        ]
      },
    },
    jshint: {
      gruntfile: {
        options: {
          jshintrc: '.jshintrc'
        },
        src: 'Gruntfile.js'
      },
      src: {
        options: {
          jshintrc: '.jshintrc'
        },
        src: ['src/**/*.js']
      }
    },

    less: {
      dev: {
        files: [
          {"build/css/dpl.css": "assets/css/less/base/dpl.less"},
          {"build/css/bui.css": "assets/css/less/bui/controls.less"},
          {"build/css/extend.css": "assets/css/less/extend/extend.less"},
          {"build/css/calendar.css": "assets/css/less/single/calendar.less"},
          {"build/css/overlay.css": "assets/css/less/single/overlay.less"},
          {"build/css/tab.css": "assets/css/less/single/tab.less"},
          {"build/css/menu.css": "assets/css/less/single/menu.less"},
          {"build/css/select.css": "assets/css/less/single/select.less"},
          {"build/css/slider.css": "assets/css/less/single/slider.less"},
          {"build/css/grid.css": "assets/css/less/single/grid.less"},
        ]
      },
      pro: {
        options: {
          yuicompress: true
        },
        files: [
          {"build/css/dpl-min.css": "assets/css/less/base/dpl.less"},
          {"build/css/bui-min.css": "assets/css/less/bui/controls.less"},
          {"build/css/extend-min.css": "assets/css/less/extend/extend.less"},
          {"build/css/calendar-min.css": "assets/css/less/single/calendar.less"},
          {"build/css/overlay-min.css": "assets/css/less/single/overlay.less"},
          {"build/css/tab-min.css": "assets/css/less/single/tab.less"},
          {"build/css/menu-min.css": "assets/css/less/single/menu.less"},
          {"build/css/select-min.css": "assets/css/less/single/select.less"},
          {"build/css/slider-min.css": "assets/css/less/single/slider.less"},
          {"build/css/grid-min.css": "assets/css/less/single/grid.less"},
        ]
      }
    },

    copy : {
      js : {
        files : [
          {"build/adapter.js" : "src/common/adapter.js"},
          {"build/extensions/treegrid.js" : "src/extensions/treegrid.js"},
          {"build/extensions/treepicker.js" : "src/extensions/treepicker.js"},
          {"build/uploader/uploader.swf" : "src/uploader/plugins/ajbridge/uploader.swf"}
        ]
      },
      img : {
        files : [
          {expand: true, cwd: './assets/img', src: ['./**/*.*'], dest: 'build/img/' }
        ]
      }
    },

    native2ascii: {
      js : {
        options: {},
        files:[
          { expand: true, cwd: './build', src: ['./**/*.js'], dest: 'build' }
        ]
      },
      css : {
        options: {},
        files:[
          { expand: true, cwd: './build', src: ['./**/*-min.css'], dest: 'build' }
        ]
      }
    },

    cssmin: {
      minify: {
        options: {
          banner: '<%= banner %>'
        },
        files:[
          {
            expand: true,
            cwd: './src/css',
            src: ['./**/*.css'],
            dest: 'build/css/',
            ext: '-min.css'
          }
        ]
      }
    },

    replace: {
      ascii: {
        src: ['build/css/**/*-min.css'],
        overwrite: true,
        replacements: [{ 
          from: "/u",
          to: "/"
        }]
      }
    },

    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      src: {
        files: ['./src/**/*.js'],
        tasks: ['concat:js']
      },
      less: {
        files:  [
          "build/css/dpl.css",
          "build/css/bui.css",
          "build/css/extend.css",
          "build/css/calendar.css",
          "build/css/overlay.css",
          "build/css/tab.css",
          "build/css/menu.css",
          "build/css/select.css",
          "build/css/slider.css",
          "build/css/grid.css",
        ],
        tasks: ['less:dev']
      }
    },
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-native2ascii');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-text-replace');


  grunt.registerTask('dev', ['concat', 'watch']);
  grunt.registerTask('build', ['clean', 'concat', 'copy', 'uglify', 'less', 'native2ascii', 'replace']);

  // Default task.
  grunt.registerTask('default', ['clean', 'concat', 'watch']);

  
};


