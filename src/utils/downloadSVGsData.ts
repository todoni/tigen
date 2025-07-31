import axios from "axios";

export const downloadSVGsData = async <T extends object>(
  data: ({ url: string } & T)[]
) => {
  return Promise.all(
    data.map(async (dataItem) => {
      const downloadedSvg = await axios.get<string>(dataItem.url);
      return {
        ...dataItem,
        data: downloadedSvg.data,
      };
    })
  );
};
