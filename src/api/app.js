import { request } from '@/utils';

export class AppService {
  // 获取推荐app列表
  static async getRecommendAppList() {
    return request.get('/rss/topgrossingapplications/limit=10/json');
  }

  // 获取免费app列表
  static async getTopAppList() {
    return request.get('/rss/topfreeapplications/limit=100/json');
  }

  // 获取app详情数据
  static async getAppDetails(data) {
    return request.get('/lookup', { data });
  }
}
