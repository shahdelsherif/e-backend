import { IsString, IsEnum, IsNumber, IsNotEmpty, Min, Max } from 'class-validator';

export class CreateQuestionnaireDto {
  
  @IsString()
  @IsNotEmpty()
  studentId: number;

  @IsString()
  @IsNotEmpty()
  department: string;

  @IsString()
  @IsNotEmpty()
  preferredCourse: string;

  @IsString()
  @IsNotEmpty()
  grade: string;

  @IsString()
  @IsNotEmpty()
  completionStatus: string;

  @IsEnum(['yes', 'no'])
  progPreferred: string;

  @IsEnum(['yes', 'no'])
  mathPreferred: string;

  @IsNumber()
  @Min(0)
  @Max(4) // Assuming GPA is on a 4-point scale
  gpa: number;

  @IsEnum(['Low', 'Medium', 'High'])
  engagementTrends: string;

  @IsNumber()
  @Min(0)
  @Max(100) // Completion rate as a percentage
  completionRate: number;

  @IsEnum(['math based courses', 'programming based courses', 'advanced courses', 'basic courses'])
  recommendedGroup: string;
}
