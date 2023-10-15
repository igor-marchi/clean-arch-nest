import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { StudentsRepository } from '../repositories/students-repository';
import { HashCompare } from '../cryptography/hash-compare';
import { Encrypter } from '../cryptography/enrypter';
import { WrongCredentialError } from './errors/wrong-credentials-error';

interface AuthenticateStudentUseCaseRequest {
  email: string;
  password: string;
}

type AuthenticateStudentUseCaseResponse = Either<
  WrongCredentialError,
  {
    accessToken: String;
  }
>;

@Injectable()
export class AuthenticateStudentUseCase {
  constructor(
    private studentsRepository: StudentsRepository,
    private hashCompare: HashCompare,
    private encrypter: Encrypter,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateStudentUseCaseRequest): Promise<AuthenticateStudentUseCaseResponse> {
    const student = await this.studentsRepository.findByEmail(email);

    if (!student) {
      return left(new WrongCredentialError());
    }

    const isPasswordValid = await this.hashCompare.compare(
      password,
      student.password,
    );

    if (!isPasswordValid) {
      return left(new WrongCredentialError());
    }

    const accessToken = await this.encrypter.encrypt({
      sub: student.id.toString(),
    });

    return right({
      accessToken,
    });
  }
}
