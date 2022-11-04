import { getDictDetail } from '@/api/system/dict';
import { onMounted, ref } from 'vue';

// eslint-disable-next-line import/prefer-default-export
export function useDict(...dictNames: string[]) {
  const res: {
    [key: string]: any;
  } = ref({});

  return (() => {
    dictNames.forEach((d) => {
      getDictDetail(d).then((resp) => {
        res.value[d] = resp.data;
      });
    });
    return res.value;
  })();
}
