<template>
  <label class="image-upload" :class="classes"
         :style="{ backgroundImage: 'url(' + imageUrl + ')' }">
    <i class="icon-cloud-upload"></i>
    <i class="icon-camera"></i>

    <input type="file" class="image-upload__input" tabindex="-1"
           @change="uploadFile($event)" accept="image/*">
  </label>
</template>

<script>
  /**
   * Компонент загрузки картинок
   */

  export default {
    props: {
      image: Object,
      modifier: String,
      size: {
        type: String,
        default: 'small'
      }
    },
    data () {
      return {
        _image: this.image
      }
    },
    computed: {
      imageUrl () {
        if (!this.image || !this.image.url) {
          return null
        }

        let source = 'estorage'
        if (process.env.NODE_ENV === 'development') {
          source = 'eteststorage'
        }
        if (this.modifier) source += '-' + this.modifier
        return 'http://' + this.image.server + '/' + source + '/' + this.image.url
      },
      classes () {
        return {
          'image-upload_loaded': !!this.image,
          'image-upload_medium': this.size === 'medium'
        }
      }
    },
    methods: {
      // Загрузка файла
      uploadFile (e) {
        if (e.target.files[0]) {
          this.$axiosFileUpload('v1/files/upload', e.target.files[0])
            .then(res => {
              this._image = {
                server: res.data.server,
                url: res.data.container + '/' + res.data.name
              }
              this.emit()
            })
        }
      },
      emit () {
        this.$emit('input', this._image)
      }
    }
  }
</script>

<style lang="less">
  .image-upload_loaded {
    color: #fff;
  }

  .image-upload {
    width: 40px;
    height: 35px;
    background: silver;
    margin: 0;
    line-height: 1rem;
    font-size: 18px;
    padding: 8px 0;
    text-align: center;
    cursor: pointer;
    display: inline-block;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;

    &_medium {
      width: 55px;
      height: 51px;
      padding: 16px 0;
    }

    .icon-cloud-upload {
      display: none;
    }
    .icon-camera {
      display: block;
    }
    &:hover {
      .icon-cloud-upload {
        display: block;
      }
      .icon-camera {
        display: none;
      }
    }
  }

  .image-upload__input {
    opacity: 0;
    position: absolute;
    z-index: -1;
  }
</style>



// WEBPACK FOOTER //
// ImageUpload.vue?2b7e19a4