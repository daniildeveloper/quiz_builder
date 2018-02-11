export default {
  get (opts) {
    const options = Object.assign({
      id: '',
      scriptUrl: '//script.marquiz.ru/v1.js',
      host: '//quiz.marquiz.ru',
      button: 'red'
    }, opts)

    const buttonClasses = ['marquiz__button']
    if (options.button) {
      buttonClasses.push('marquiz__button_' + options.button)
    }
    const buttonClass = buttonClasses.join(' ')

    let script = `<!-- Marquiz script start -->
<script src="${options.scriptUrl}" type="application/javascript"></script>
<script>
document.addEventListener("DOMContentLoaded", function() {
  Marquiz.init({
    id: '${options.id}',
    host: '${options.host}',
    template: 'default'
  });
});
</script>
`
    if (options.buttonText) {
      script += `<div class="marquiz__container">
  <button class="${buttonClass}" onclick="Marquiz.showModal()">${options.buttonText}</button>
</div>
`
    }
    script += `<!-- Marquiz script end -->
`

    return script
  }
}



// WEBPACK FOOTER //
// ./src/scripts/v1.js