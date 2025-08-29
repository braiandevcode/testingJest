import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NotebooksService } from './notebooks.service';
import { CreateNotebookDto } from './dto/create-notebook.dto';
import { UpdateNotebookDto } from './dto/update-notebook.dto';

@Controller('notebooks')
export class NotebooksController {
  constructor(private readonly notebooksService: NotebooksService) {}

  @Post()
  create(@Body() createNotebookDto: CreateNotebookDto) {
    return this.notebooksService.create(createNotebookDto);
  }

  @Get()
  findAll() {
    return this.notebooksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notebooksService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNotebookDto: UpdateNotebookDto) {
    return this.notebooksService.update(+id, updateNotebookDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notebooksService.remove(+id);
  }
}
