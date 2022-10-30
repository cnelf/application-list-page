<script setup>
  import { ref, reactive, onMounted, computed } from 'vue';
  import { AppService } from '@/api';
  import { autoLoading } from '@/utils';

  // 分页相关参数
  const page = {
    current: 0,
    pageSize: 20,
    total: 100
  };
  const loading = ref(false);
  const finished = ref(false);
  const searchFlag = ref(false);
  const state = reactive({
    recommendAppList: [],
    topAppList: [],
    currentTopAppList: [],
    searchFilterList: []
  });
  const showTopAppList = computed(() => (searchFlag.value ? state.searchFilterList : state.currentTopAppList));

  onMounted(async () => {
    const [res1, res2] = await autoLoading(Promise.all([AppService.getRecommendAppList(), AppService.getTopAppList()]));
    state.recommendAppList = res1?.feed?.entry || [];
    state.topAppList = res2?.feed?.entry || [];
    onLoadTopList();
  });

  // 加载更多
  const onLoadTopList = async () => {
    if (searchFlag.value) return;

    const { current, pageSize, total } = page;

    if (current < total) {
      const list = state.topAppList.slice(current, current + pageSize);
      const listIds = list.map((item) => item.id.attributes['im:id']);
      const res = await autoLoading(AppService.getAppDetails({ id: listIds.join(',') }));

      // 获取应用评分和评论数
      (res?.results || []).forEach((item, index) => {
        list[index].averageUserRating = item.averageUserRating || 0;
        list[index].userRatingCount = item.userRatingCount || 0;
      });

      page.current = current + pageSize;
      state.currentTopAppList = state.currentTopAppList.concat(list);
      loading.value = false;
    } else {
      finished.value = true;
    }
  };

  // 搜索应用
  function handleSearch(e) {
    const keyword = e.target.value.trim();
    if (keyword) {
      // 模糊匹配应用名称、开发者名称和应用描述
      const list = state.currentTopAppList.filter((item) => {
        return (
          !!item['im:name'].label.match(keyword) ||
          !!item['im:artist'].label.match(keyword) ||
          !!item['summary'].label.match(keyword)
        );
      });
      state.searchFilterList = list;
      searchFlag.value = true;
      finished.value = true;
    } else {
      searchFlag.value = false;
      const { current, total } = page;
      if (current < total) {
        finished.value = false;
      } else {
        finished.value = true;
      }
    }
  }
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
          <div class="app-item" v-for="item in state.recommendAppList" :key="item.id.attributes['im:id']">
            <van-image class="app-icon" :src="item['im:image'][0].label" alt="App Icon" />
            <div class="app-name text-ellipsis">{{ item['im:name'].label }}</div>
            <div class="app-type">{{ item.category.attributes.label }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="top-list-wrapper" v-if="showTopAppList.length">
      <van-list
        class="top-list"
        v-model:loading="loading"
        :finished="finished"
        :immediate-check="false"
        finished-text="没有更多了"
        @load="onLoadTopList"
      >
        <div class="app-item-wrapper" v-for="(item, index) in showTopAppList" :key="item.id.attributes['im:id']">
          <div class="number">{{ index + 1 }}</div>
          <div class="app-item">
            <van-image class="app-icon" :src="item['im:image'][0].label" alt="App Icon" />
            <div class="app-item-content">
              <div class="app-name text-ellipsis">{{ item['im:name'].label }}</div>
              <div class="app-type">{{ item.category.attributes.label }}</div>
              <div class="rating">
                <van-rate
                  class="rate-star"
                  v-model="item.averageUserRating"
                  size="3.2vw"
                  gutter="0"
                  color="#f5ca4c"
                  readonly
                  allow-half
                />
                <div class="rate-number">({{ item.userRatingCount }})</div>
              </div>
            </div>
          </div>
        </div>
      </van-list>
    </div>
    <van-empty v-else description="暂无数据" />
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
            text-align: center;
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
            flex-shrink: 0;
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
