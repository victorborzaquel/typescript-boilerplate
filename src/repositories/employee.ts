import {db} from '@/lib/typeorm';
import {Employee} from '@/lib/typeorm/entities/employee';
import {Repository} from 'typeorm';

export class EmployeeRepository {
  private repository: Repository<Employee>;

  constructor() {
    this.repository = db.getRepository(Employee);
  }

  findByNumber(number: string): Promise<Employee | null> {
    return this.repository.findOneBy({number});
  }

  save(employee: Employee): Promise<Employee> {
    return this.repository.save(employee);
  }
}
