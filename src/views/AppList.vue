<script setup>
  import { ref } from 'vue';

  function handleSearch(e) {
    console.log('search', e.target.value);
  }

  const value = ref(4.6);
</script>

<template>
  <div class="page">
    <div class="search-wrapper">
      <div class="search">
        <van-icon class="icon-search" name="search" />
        <input class="input" type="text" placeholder="Search..." @keyup.enter="handleSearch" />
      </div>
    </div>
    <div class="recommend-area">
      <div class="title">Recommend</div>
      <div class="recommend-list-wrapper">
        <div class="recommend-list">
          <div class="app-item" v-for="i in 10" :key="i">
            <van-image class="app-icon" src="https://picsum.photos/100/100" alt="App Icon" />
            <div class="app-name text-ellipsis">圣斗士星矢巴拉巴拉巴拉巴拉</div>
            <div class="app-type">游戏</div>
          </div>
        </div>
      </div>
    </div>
    <div class="top-list-wrapper">
      <div class="top-list">
        <div class="app-item-wrapper" v-for="i in 20" :key="i">
          <div class="number">{{ i }}</div>
          <div class="app-item">
            <van-image class="app-icon" src="https://picsum.photos/100/100" alt="App Icon" />
            <div class="app-item-content">
              <div class="app-name">UNIQLO Hong Kong & Macau</div>
              <div class="app-type">生活风格</div>
              <div class="rating">
                <van-rate
                  class="rate-star"
                  v-model="value"
                  size="3.2vw"
                  gutter="0"
                  color="#f5ca4c"
                  readonly
                  allow-half
                />
                <div class="rate-number">(144)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .search-wrapper {
    border-bottom: 1px solid #ecebeb;
    padding: 16px 8px 10px;

    .search {
      display: flex;
      align-items: center;
      border-radius: 16px;
      padding: 0 8px;
      height: 42px;
      font-size: 16px;
      color: #999;
      background: #f4f4f4;

      .input {
        flex: 1;
        margin-left: 8px;
        border: 0;
        background: #f4f4f4;

        &::placeholder {
          color: #999;
        }
      }
    }
  }

  .recommend-area {
    border-bottom: 1px solid #ecebeb;
    padding: 10px 0 0 16px;

    .title {
      font-size: 16px;
    }

    .recommend-list-wrapper {
      display: flex;
      overflow-x: auto;
      overflow-y: hidden;
      margin-top: 10px;
      padding-bottom: 10px;
      scrollbar-width: none;

      &::-webkit-scrollbar {
        display: none;
      }

      .recommend-list {
        display: flex;

        .app-item {
          display: flex;
          flex-shrink: 0;
          flex-direction: column;
          align-items: center;
          margin-right: 24px;

          .app-icon {
            overflow: hidden;
            border-radius: 20px;
            width: 86px;
            height: 86px;
          }

          .app-name {
            margin-top: 8px;
            width: 80px;
          }

          .app-type {
            margin-top: 4px;
            color: #999;
          }
        }
      }
    }
  }

  .top-list-wrapper {
    overflow: auto;
    padding-left: 16px;
    height: calc(100vh - 250px);

    .top-list {
      .app-item-wrapper {
        display: flex;
        align-items: center;
        border-bottom: 1px solid #ecebeb;
        padding: 12px 0;

        .number {
          font-size: 12px;
          color: #999;
        }

        .app-item {
          display: flex;
          margin-left: 16px;
          line-height: 1;

          .app-icon {
            overflow: hidden;
            width: 62px;
            height: 62px;
          }

          .app-item-content {
            margin-left: 8px;

            .app-type {
              margin-top: 8px;
              font-size: 12px;
              color: #999;
            }

            .rating {
              display: flex;
              align-items: center;
              margin-top: 12px;

              .rate-number {
                margin-left: 4px;
                font-size: 10px;
                color: #999;
              }
            }
          }
        }

        &:nth-of-type(odd) {
          .app-icon {
            border-radius: 12px;
          }
        }

        &:nth-of-type(even) {
          .app-icon {
            border-radius: 50%;
          }
        }
      }
    }
  }
</style>
