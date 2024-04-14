export type CourseData = {
    id: string,
    name: string,
    description: string,
    imageUrl: string,
    price: number,
    isPublished: boolean,
    categoryId: string,
    category: string,
    createdAt: string,
  };

export type CourseModule = {
  id: string;
  name: string;
  courseId: string;
  createdAt: string;
  details: string;
  orderNo: number;
  updatedAt: string;
  videoUrl: string;
};
export type ModuleInputInfo = OmitMultiple<CourseModule, "courseId" | "id" | "createdAt" | "updatedAt">

export type OmitMultiple<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type CourseInputInfo = OmitMultiple<CourseData, "category" | "id" | "createdAt">