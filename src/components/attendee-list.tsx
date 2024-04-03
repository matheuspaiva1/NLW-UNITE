import {Search, MoreHorizontal, ChevronsLeft, ChevronLeft, ChevronsRight, ChevronRight} from 'lucide-react';
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
import relativeTime from 'dayjs/plugin/relativeTime'
import { IconButton } from './icon-button';
import { Table } from './tables/table';
import { TableHead } from './tables/table-header';
import { TableCell } from './tables/table-cell';
import { TableRow } from './tables/table-row';
import { ChangeEvent, useState } from 'react';
import { attendees } from './data/attendees';

dayjs.extend(relativeTime)
dayjs.locale('pt-br')
export function AttendeeList(){
  const [search, setSearch] = useState('')

  const [page, setPage] = useState(1)

  const totalPages = Math.ceil(attendees.length/10)

  function goToNextPage(){
    return setPage(page + 1)
  }

  function goToPastPage(){
    return setPage(page - 1)
  }

  function goToLastPage(){
    return setPage(totalPages)
  }

  function goToFirstPage(){
    return setPage(1)
  }

  function onSearchInputChanged(event: ChangeEvent<HTMLInputElement>){
    setSearch(event.target.value)
  }
  return (

    <div className="flex flex-col gap-4">
      <div className="flex gap-3 items-center">
        <h1 className="text-2xl font-bold">Participantes</h1>
        <div className="px-3 w-72 py-4 border border-white/10 rounded-lg text-sm flex items-center gap-3" >
          <Search className="size-4 text-emerald-300"/>
          <input onChange={onSearchInputChanged} placeholder="Buscar Participante..." className="bg-transparent flex-1 outline-none border-0 p-0 text-sm"  />
        </div>
        {search}

      </div>


      <Table>

        <thead>
          <TableRow className="border-b border-white/10">
            <TableHead > 
              <input type="checkbox"  className="size-4 bg-black/20 rounded border border-white/10 " name="" id="" />
            </TableHead>
            <TableHead >Codigo</TableHead>
            <TableHead >Participante</TableHead>
            <TableHead >Data de Inscrição</TableHead>
            <TableHead >Data do Check-In</TableHead>
            <TableHead style= {{width:64}} ></TableHead>
          </TableRow>
        </thead>

        <tbody>
          {attendees.slice((page-1)*10,page*10).map((attendee)=> {
            return (
              <TableRow key={attendee.id} className="border-b border-white/10 hover:bg-white/5">
                <TableCell>
                  <input type="checkbox" className="size-4 bg-black/20 rounded border border-white/10 " name="" id="" />
                </TableCell>
                <TableCell>{attendee.id}</TableCell>
                <TableCell>
                  <div>
                    <span className="flex flex-col gap-1 font-semibold">{attendee.name}</span>
                    <span>{attendee.email}</span>
                  </div>
                </TableCell>
                <TableCell>{dayjs().to(attendee.createdAt)}</TableCell>
                <TableCell>{dayjs().to(attendee.checkedInAt)}</TableCell>
                <TableCell>
                  <button className="bg-black/20 border border-white/10 rounded-md p-1.5 ">
                    <MoreHorizontal className="size-4"/>
                  </button>
                </TableCell>
              </TableRow>
            )
          })}
        </tbody>

        <tfoot>
          <TableRow>
            <TableCell colSpan={3} >Mostrando 10 de {attendees.length} itens</TableCell>
            
            <TableCell colSpan={3} className="text-right"> 
              <div className="inline-flex flex items-center gap-8">
                <span>Pagina {page} de {totalPages}</span> 
                <div className="flex gap-1.5">
                <IconButton onClick={goToFirstPage} disabled={page==1}>
                  <ChevronsLeft className="size-4"/>
                </IconButton>

                <IconButton onClick={goToPastPage} disabled={page==1}>
                  <ChevronLeft className="size-4"/>
                </IconButton>

                <IconButton onClick={goToNextPage} disabled={page==totalPages}>
                  <ChevronRight className="size-4"/>
                </IconButton>

                <IconButton onClick={goToLastPage} disabled={page==totalPages}>
                  <ChevronsRight className="size-4"/>
                </IconButton>

                </div>

              </div>
            </TableCell>
          </TableRow>
        </tfoot>
        </Table>
    </div>
  )
}