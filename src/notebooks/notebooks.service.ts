import { Injectable } from '@nestjs/common';
import { CreateNotebookDto } from './dto/create-notebook.dto';
import { UpdateNotebookDto } from './dto/update-notebook.dto';

@Injectable()
export class NotebooksService {
  create(createNotebookDto: CreateNotebookDto) {
    return 'This action adds a new notebook';
  }

  findAll() {
    return `This action returns all notebooks`;
  }

  findOne(id: number) {
    return `This action returns a #${id} notebook`;
  }

  update(id: number, updateNotebookDto: UpdateNotebookDto) {
    return `This action updates a #${id} notebook`;
  }

  remove(id: number) {
    return `This action removes a #${id} notebook`;
  }
}
