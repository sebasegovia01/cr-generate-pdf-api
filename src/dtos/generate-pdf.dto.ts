export class GeneratePdfDto {
  name: string;
  template: string;
  data: {
    header: {
      userName: string;
    },
    movements: [];
  }
}