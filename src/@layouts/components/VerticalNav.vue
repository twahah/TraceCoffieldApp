<script setup>
import axios from 'axios'
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import logoImg from '@images/logo.png'
import { layoutConfig } from '@layouts'
import {  VerticalNavGroup, VerticalNavLink, VerticalNavSectionTitle } from '@layouts/components'
import { useLayoutConfigStore } from '@layouts/stores/config'
import { injectionKeyIsVerticalNavHovered } from '@layouts/symbols'

const props = defineProps({
  tag: { type: [String, Object, Function,], required: false, default: 'aside',},
  navItems: { type: null, required: true,},
  isOverlayNavActive: { type: Boolean, required: true, },
  toggleIsOverlayNavActive: { type: Function, required: true,},
})

const refNav = ref()
const isHovered = useElementHover(refNav)

provide(injectionKeyIsVerticalNavHovered, isHovered)

const configStore = useLayoutConfigStore()

const resolveNavItemComponent = item => {
  if ('heading' in item)
    return VerticalNavSectionTitle
  if ('children' in item)
    return VerticalNavGroup
  
  return VerticalNavLink
}

/*ℹ️ Close overlay side when route is changed
Close overlay vertical nav when link is clicked
*/
const route = useRoute()
const userData = JSON.parse(localStorage.getItem("user"));

watch(() => route.name, () => {
  props.toggleIsOverlayNavActive(false)
})

const isVerticalNavScrolled = ref(false)
const updateIsVerticalNavScrolled = val => isVerticalNavScrolled.value = val

const handleNavScroll = evt => {
  isVerticalNavScrolled.value = evt.target.scrollTop > 0
}

const hideTitleAndIcon = configStore.isVerticalNavMini(isHovered)

let logo = logoImg;

if (userData && userData.logo) {
  let baseUrl = axios.getUri();
  baseUrl = baseUrl.slice(0, -3); 
  logo = `${baseUrl}/logos/${userData.logo}`;
}
</script>

<template>
  <Component
    :is="props.tag"
    ref="refNav"
    class="layout-vertical-nav"
    :class="[
      {
        'overlay-nav': configStore.isLessThanOverlayNavBreakpoint,
        'hovered': isHovered,
        'visible': isOverlayNavActive,
        'scrolled': isVerticalNavScrolled,
      },
    ]"
     style="background: rgba(var(--v-theme-primary)); color: white;"
  >
    <!-- 👉 Header -->
    <div class="nav-header">
      <slot name="nav-header">
        <RouterLink to="/" class="app-title-wrapper ">
        <VImg max-width="50" :src="logo || logoImg" class="app-logo mt-2 mb-2" />
          <!-- <Transition name="vertical-nav-app-title"> -->
            <h1 v-show="!hideTitleAndIcon" class="app-logo-title leading-normal">
              {{ layoutConfig.app.title }}
            </h1>
          <!-- </Transition> -->
        </RouterLink>
        <!-- 👉 Vertical nav actions -->
        <!-- Show toggle collapsible in >md and close button in <md -->
        <Component
          :is="layoutConfig.app.iconRenderer || 'div'"
          v-show="configStore.isVerticalNavCollapsed"
          class="header-action d-none nav-unpin"
          :class="configStore.isVerticalNavCollapsed && 'd-lg-block'"
          v-bind="layoutConfig.icons.verticalNavUnPinned"
          @click="configStore.isVerticalNavCollapsed = !configStore.isVerticalNavCollapsed"
        />
        <Component
          :is="layoutConfig.app.iconRenderer || 'div'"
          v-show="!configStore.isVerticalNavCollapsed"
          class="header-action d-none nav-pin"
          :class="!configStore.isVerticalNavCollapsed && 'd-lg-block'"
          v-bind="layoutConfig.icons.verticalNavPinned"
          @click="configStore.isVerticalNavCollapsed = !configStore.isVerticalNavCollapsed"
        />
        <Component
          :is="layoutConfig.app.iconRenderer || 'div'"
          class="header-action d-lg-none text-white" 
          v-bind="layoutConfig.icons.close"
          @click="toggleIsOverlayNavActive(false)"
        />
      </slot>
    </div>
    <slot name="before-nav-items">
      <div class="vertical-nav-items-shadow" />
    </slot>
    <slot
      name="nav-items"
      :update-is-vertical-nav-scrolled="updateIsVerticalNavScrolled"
    >
      <PerfectScrollbar
        :key="configStore.isAppRTL"
        tag="ul"
        class="nav-items"
        :options="{ wheelPropagation: false }"
        @ps-scroll-y="handleNavScroll"
      >
        <Component
          :is="resolveNavItemComponent(item)"
          v-for="(item, index) in navItems"
          :key="index"
          :item="item"
        />
      </PerfectScrollbar>
    </slot>
  </Component>
</template>

<style lang="scss" scoped>
.app-logo {
  border-radius: 50%;
}

.app-logo-title {
  color: #FFFFFFFF;
  font-size: 1.3rem;
  font-weight: 700;
  line-height: 1.75rem;
  text-transform: capitalize;
}
</style>

<style lang="scss">
@use "@configured-variables" as variables;
@use "@layouts/styles/mixins";

// 👉 Vertical Nav
.layout-vertical-nav {
  position: fixed;
  z-index: variables.$layout-vertical-nav-z-index;
  display: flex;
  flex-direction: column;
  block-size: 100%;
  inline-size: variables.$layout-vertical-nav-width;
  inset-block-start: 0;
  inset-inline-start: 0;
  transition: inline-size 0.25s ease-in-out, box-shadow 0.25s ease-in-out;
  will-change: transform, inline-size;

  .nav-header {
    display: flex;
    align-items: center;

    .header-action {
      cursor: pointer;

      @at-root {
        #{variables.$selector-vertical-nav-mini} .nav-header .header-action {
          &.nav-pin,
          &.nav-unpin {
            display: none !important;
          }
        }
      }
    }
  }

  .app-title-wrapper {
    margin-inline-end: auto;
    
  }
  .mode {
    border: 1px solid #054b7a;
    background: #FFFFFF;
    color: #0251A6;
    box-shadow: 2px 2px 6px rgb(20, 41, 127);

    padding: 8px 18px;        /* wider to look like a pill */
    border-radius: 50px;      /* full pill shape */
    font-size: 0.85rem;
    font-weight: 500;

    display: inline-flex;     
    align-items: center;
    justify-content: center;
    cursor: help;
    transition: 0.2s ease-in-out;
}

.mode:hover {
    background: #64b1fe;
    box-shadow: 2px 3px 7px rgb(3, 88, 216);
}


  .nav-items {
    block-size: 100%;
  }

  .nav-item-title {
    overflow: hidden;
    margin-inline-end: auto;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  // 👉 Collapsed
  .layout-vertical-nav-collapsed & {
    &:not(.hovered) {
      inline-size: variables.$layout-vertical-nav-collapsed-width;
    }
  }
}

// Small screen vertical nav transition
@media (max-width:1279px) {
  .layout-vertical-nav {
    &:not(.visible) {
      transform: translateX(-#{variables.$layout-vertical-nav-width});

      @include mixins.rtl {
        transform: translateX(variables.$layout-vertical-nav-width);
      }
    }

    transition: transform 0.25s ease-in-out;
  }
}
</style>
