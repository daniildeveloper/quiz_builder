<template lang="pug">
  div
    div
      alert(type='info', :dismissable='true')
        h3 {{ $t('Что дальше?') }}
        p
          | {{ $t('Прочитайте небольшие инструкции, как вставить квиз на лендинг или сайт.') }}
        p
          a.btn.btn-info(@click='instructions = true') Прочитать инструкцию
        p
          | {{ $t('Если коротко, то выберите дизайн кнопки, скопируйте код и вставьте его в то место, где должна быть кнопка.') }}
          br
          | {{ $t('Если наша кнопка не подходит по дизайну, тогда удалите текст кнопки, скопируйте и вставьте код. У Вашей кнопки укажите ссылку "#popup:marquiz"') }}
          | {{ $t('Код нужно вставить один раз. В дальнейшем, при редактировании квиза, изменения отобразятся автоматически. Код нужно ��удет поменять только, если вы изменили дизайн кнопки.') }}
    
    modal.modal-info(:title="$t('Как вставить квиз на лендинг')", v-model='instructions', effect='fade/zoom', large='')
      Instructions
        div(slot='modal-footer')
    
    .row.util-mb
      
      .col-sm-6
        .card
          .card-header
            | {{ $t('Настройки кнопки') }}
          .card-block

            ColorPicker.clearfix(:colors='buttonColors', v-model='button')

            .form-group
              label.form-control-label Текст кнопки
              input.form-control(type='text', v-model='buttonText', :placeholder="$t('Введите текст кнопки')")
              span.help-block {{ $t('Оставьте пустым, чтобы скрипт был без кнопки') }}
            
            p.text-center {{ $t('Предпросмотр') }}:
            p.text-center
              button.marquiz__button(v-if='buttonText', :class="'marquiz__button_' + buttons[button]") {{ buttonText }}
      
      .col-sm-6
        .script__buttons
          button.btn.btn-primary.btn-medium.btn-lg(@click='copy')
            | {{ copyText }} 
            i.icon-layers
        textarea#scriptarea.form-control(readonly='', v-model='script', @focus='$event.target.select()', rows='16')

</template>


<script>
  import copy from 'copy-to-clipboard'
  import script from '@/scripts/v1'
  import ColorPicker from '@/components/ColorPicker'
  import Instructions from '@/components/Instructions'

  export default {
    components: {
      ColorPicker, Instructions
    },
    mounted () {
      this.select()
    },
    data () {
      return {
        copyText: this.$t('Скопировать'),
        buttonText: this.$t('Пройти тест'),
        color: '#f86c6b',
        button: 0,
        instructions: false,
        buttons: ['red', 'yellow', 'blue', 'green'],
        buttonColors: ['#f86c6b', '#f8cb00', '#20a8d8', '#4dbd74']
      }
    },
    computed: {
      script () {
        return script.get({ id: this.id, buttonText: this.buttonText, button: this.buttons[this.button] })
      }
    },
    methods: {
      copy () {
        copy(this.script)
        this.copyText = this.$t('Скопировано')
        setTimeout(() => {
          this.copyText = this.$t('Скопировать')
        }, 2000)
        this.select()
        this.$analytic.event('quiz-copy-script')
      },
      select () {
        document.getElementById('scriptarea').select()
      }
    },
    props: {
      id: String
    }
  }
</script>

<style>
  .script__buttons {
    margin-bottom: 1.5rem;
  }

  .marquiz__button {
    display: inline-block;
    font-weight: normal;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    user-select: none;
    transition: all 0.2s ease-in-out;
    color: #fff;
    border: 1px solid #20a8d8;
    background-color: #20a8d8;
    padding: 12px 31px;
    font-size: 24px;
    line-height: 1.5;
  }

  .marquiz__button_red {
    background-color: #f86c6b;
    border-color: #f86c6b;
  }

  .marquiz__button_yellow {
    background-color: #f8cb00;
    border-color: #f8cb00;
    color: #000;
  }

  .marquiz__button_blue {
    background-color: #20a8d8;
    border-color: #20a8d8;
  }

  .marquiz__button_green {
    background-color: #4dbd74;
    border-color: #4dbd74;
  }

  .util-mb {
    margin-bottom: 1.5rem;
  }
</style>



// WEBPACK FOOTER //
// Script.vue?bdf8aca8