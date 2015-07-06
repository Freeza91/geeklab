// 积分商城javascripts manifest
//
// jquery
//= require jquery
//= require jquery_ujs
//
// bootstrap
//= require bootstrap
//
// vue
// require vue

// nested_form
//= require jquery_nested_form

// simditor
//= require simditor

$(function(){
  var editor;
  editor = new Simditor({
    textarea: $('#simditor'),
    upload: true,
    toolbar: ['bold', 'italic', 'underline', '|', 'ol', 'ul', 'blockquote', 'code', '|', 'link', 'image', '|', 'indent', 'outdent', '|', 'hr', 'table']
  });
});