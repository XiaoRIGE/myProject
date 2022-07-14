import {
  IQueryUserFace,
  queryUserFace
} from '@/request/api/presenter/queryUserFace';

export default function useGetFacePhoto() {
  const getFaceData = async (studentId: string) => {
    const params: IQueryUserFace = { studentId };
    const result = await queryUserFace(params);
    return result.data.data;
  };

  return {
    getFaceData
  };
}
