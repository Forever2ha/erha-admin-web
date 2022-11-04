<template>
  <a-popover
    v-model:popup-visible="popVisible"
    trigger="click"
    position="bottom"
    style="width: 900px; margin-left: -20px"
  >
    <a-input
      :model-value="props.icon"
      :default-value="props.defaultValue"
      @input="$emit('update:icon', modelValue)"
    >
      <template #prefix>
        <component
          :is="
            props.icon === undefined
              ? props.defaultValue === undefined
                ? 'icon-search'
                : props.defaultValue
              : props.icon
          "
        />
      </template>
    </a-input>
    <template #content
      ><div class="icon-body">
        <div class="icon-list">
          <div v-for="(iconArr, group) in Icon" :key="group">
            <a-divider orientation="center">
              <a-tag color="green">
                {{ group }}
              </a-tag>
            </a-divider>
            <div
              v-for="(name, index) in iconArr"
              :key="index"
              class="icon"
              @click="iconClick(name)"
            >
              <component :is="name" />&nbsp;&nbsp;
              <span>{{ name }}</span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </a-popover>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue';

  const modelValue = ref('');

  const props = withDefaults(
    defineProps<{
      icon?: string;
      defaultValue?: string;
    }>(),
    {}
  );
  const emit = defineEmits(['update:icon']);

  const popVisible = ref(false);
  const iconClick = (name: string) => {
    emit('update:icon', name);
    modelValue.value = name;
    popVisible.value = false;
  };
  const Icon = {
    方向指示类图标: [
      'icon-arrow-down',
      'icon-arrow-fall',
      'icon-arrow-left',
      'icon-arrow-right',
      'icon-arrow-rise',
      'icon-arrow-up',
      'icon-caret-down',
      'icon-caret-left',
      'icon-caret-right',
      'icon-caret-up',
      'icon-double-down',
      'icon-double-left',
      'icon-double-right',
      'icon-double-up',
      'icon-down-circle',
      'icon-down',
      'icon-drag-arrow',
      'icon-expand',
      'icon-left-circle',
      'icon-left',
      'icon-menu-fold',
      'icon-menu-unfold',
      'icon-right-circle',
      'icon-right',
      'icon-rotate-left',
      'icon-rotate-right',
      'icon-shrink',
      'icon-swap',
      'icon-to-bottom',
      'icon-to-left',
      'icon-to-right',
      'icon-to-top',
      'icon-up-circle',
      'icon-up',
    ],
    提示建议类图标: [
      'icon-check-circle-fill',
      'icon-close-circle-fill',
      'icon-exclamation-circle-fill',
      'icon-exclamation-polygon-fill',
      'icon-info-circle-fill',
      'icon-minus-circle-fill',
      'icon-plus-circle-fill',
      'icon-question-circle-fill',
      'icon-check-circle',
      'icon-check-square',
      'icon-check',
      'icon-clock-circle',
      'icon-close-circle',
      'icon-close',
      'icon-exclamation-circle',
      'icon-exclamation',
      'icon-info-circle',
      'icon-info',
      'icon-minus-circle',
      'icon-minus',
      'icon-plus-circle',
      'icon-plus',
      'icon-question-circle',
      'icon-question',
      'icon-stop',
    ],
    交互按钮类图标: [
      'icon-heart-fill',
      'icon-star-fill',
      'icon-thumb-down-fill',
      'icon-thumb-up-fill',
      'icon-at',
      'icon-cloud-download',
      'icon-code-block',
      'icon-code-square',
      'icon-code',
      'icon-customer-service',
      'icon-download',
      'icon-export',
      'icon-eye-invisible',
      'icon-eye',
      'icon-heart',
      'icon-history',
      'icon-home',
      'icon-import',
      'icon-launch',
      'icon-list',
      'icon-message-banned',
      'icon-message',
      'icon-more-vertical',
      'icon-more',
      'icon-poweroff',
      'icon-refresh',
      'icon-reply',
      'icon-save',
      'icon-scan',
      'icon-search',
      'icon-select-all',
      'icon-send',
      'icon-settings',
      'icon-share-alt',
      'icon-share-alt',
      'icon-share-external',
      'icon-share-internal',
      'icon-star',
      'icon-sync',
      'icon-thumb-down',
      'icon-thumb-up',
      'icon-translate',
      'icon-upload',
      'icon-voice',
    ],
    编辑类图标: [
      'icon-align-center',
      'icon-align-left',
      'icon-align-right',
      'icon-attachment',
      'icon-bg-colors',
      'icon-bold',
      'icon-brush',
      'icon-copy',
      'icon-delete',
      'icon-edit',
      'icon-eraser',
      'icon-filter',
      'icon-find-replace',
      'icon-font-colors',
      'icon-formula',
      'icon-h1',
      'icon-h2',
      'icon-h3',
      'icon-h4',
      'icon-h5',
      'icon-h6',
      'icon-h7',
      'icon-highlight',
      'icon-italic',
      'icon-line-height',
      'icon-link',
      'icon-oblique-line',
      'icon-ordered-list',
      'icon-original-size',
      'icon-paste',
      'icon-quote',
      'icon-redo',
      'icon-scissor',
      'icon-scissor',
      'icon-sort-ascending',
      'icon-sort-descending',
      'icon-sort',
      'icon-strikethrough',
      'icon-underline',
      'icon-undo',
      'icon-unordered-list',
      'icon-zoom-in',
      'icon-zoom-out',
    ],
    影音类图标: [
      'icon-mute-fill',
      'icon-pause-circle-fill',
      'icon-play-arrow-fill',
      'icon-play-circle-fill',
      'icon-skip-next-fill',
      'icon-skip-previous-fill',
      'icon-sound-fill',
      'icon-backward',
      'icon-forward',
      'icon-fullscreen-exit',
      'icon-fullscreen',
      'icon-live-broadcast',
      'icon-music',
      'icon-mute',
      'icon-pause-circle',
      'icon-pause',
      'icon-play-arrow',
      'icon-play-circle',
      'icon-record-stop',
      'icon-record',
      'icon-skip-next',
      'icon-skip-previous',
      'icon-sound',
    ],
    商标类图标: [
      'icon-bytedance-color',
      'icon-lark-color',
      'icon-tiktok-color',
      'icon-xigua-color',
      'icon-faceBook-circle-fill',
      'icon-facebook-square-fill',
      'icon-google-circle-fill',
      'icon-qq-circle-fill',
      'icon-twitter-circle-fill',
      'icon-weibo-circle-fill',
      'icon-alipay-circle',
      'icon-code-sandbox',
      'icon-codepen',
      'icon-facebook',
      'icon-github',
      'icon-gitlab',
      'icon-google',
      'icon-qq-zone',
      'icon-qq',
      'icon-twitter',
      'icon-wechat',
      'icon-wechatpay',
      'icon-weibo',
    ],
    通用类图标: [
      'icon-chinese-fill',
      'icon-english-fill',
      'icon-face-frown-fill',
      'icon-face-meh-fill',
      'icon-face-smile-fill',
      'icon-moon-fill',
      'icon-pen-fill',
      'icon-sun-fill',
      'icon-apps',
      'icon-archive',
      'icon-bar-chart',
      'icon-book',
      'icon-bookmark',
      'icon-branch',
      'icon-bug',
      'icon-bulb',
      'icon-calendar-clock',
      'icon-calendar',
      'icon-camera',
      'icon-cloud',
      'icon-command',
      'icon-common',
      'icon-compass',
      'icon-computer',
      'icon-copyright',
      'icon-dashboard',
      'icon-desktop',
      'icon-dice',
      'icon-drag-dot-vertical',
      'icon-drag-dot',
      'icon-drive-file',
      'icon-ear',
      'icon-email',
      'icon-empty',
      'icon-experiment',
      'icon-file-audio',
      'icon-file-image',
      'icon-file-pdf',
      'icon-file-video',
      'icon-file',
      'icon-fire',
      'icon-folder-add',
      'icon-folder-delete',
      'icon-folder',
      'icon-gift',
      'icon-idcard',
      'icon-image-close',
      'icon-image',
      'icon-interaction',
      'icon-language',
      'icon-layers',
      'icon-layout',
      'icon-loading',
      'icon-location',
      'icon-lock',
      'icon-loop',
      'icon-man',
      'icon-menu',
      'icon-mind-mapping',
      'icon-mobile',
      'icon-moon',
      'icon-mosaic',
      'icon-nav',
      'icon-notification-close',
      'icon-notification',
      'icon-palette',
      'icon-pen',
      'icon-phone',
      'icon-printer',
      'icon-public',
      'icon-pushpin',
      'icon-qrcode',
      'icon-relation',
      'icon-robot-add',
      'icon-robot',
      'icon-safe',
      'icon-schedule',
      'icon-shake',
      'icon-skin',
      'icon-stamp',
      'icon-storage',
      'icon-subscribe-add',
      'icon-subscribe',
      'icon-subscribed',
      'icon-sun',
      'icon-tag',
      'icon-tags',
      'icon-thunderbolt',
      'icon-tool',
      'icon-trophy',
      'icon-unlock',
      'icon-user-add',
      'icon-user-group',
      'icon-user',
      'icon-video-camera',
      'icon-wifi',
      'icon-woman',
    ],
  };
</script>

<style lang="less" scoped>
  .icon-body {
    width: 100%;
    .icon-list {
      height: 200px;
      overflow-y: scroll;
      div.icon {
        height: 30px;
        line-height: 30px;
        margin-bottom: -5px;
        cursor: pointer;
        width: 33%;
        float: left;
      }
    }
  }
</style>
