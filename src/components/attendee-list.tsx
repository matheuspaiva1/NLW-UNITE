import {Search, MoreHorizontal, ChevronsLeft, ChevronLeft, ChevronsRight, ChevronRight} from 'lucide-react';
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
import relativeTime from 'dayjs/plugin/relativeTime'
import { IconButton } from './icon-button';
import { Table } from './tables/table';
import { TableHead } from './tables/table-header';
import { TableCell } from './tables/table-cell';
import { TableRow } from './tables/table-row';
import { ChangeEvent, useEffect, useState } from 'react';

dayjs.extend(relativeTime)
dayjs.locale('pt-br')

interface Attendee {
  id: string,
  name: string,
  email: string,
  checkedInAt: string | null,
  createdAt: string
}
export function AttendeeList(){
  const [search, setSearch] = useState(() => {
    const url = new URL(window.location.toString())
  
    if (url.searchParams.has('search')){
      return url.searchParams.get('search') ?? ''
    }
    return ''
   })

 const [page, setPage] = useState(() => {
  const url = new URL(window.location.toString())

  if (url.searchParams.has('page')){
    return Number(url.searchParams.get('page'))
  }
  return 1
 })

  const [total, setTotal] = useState(1)

  const [attendees, setAttendees] = useState<Attendee[]>([])


  useEffect(() => {
    const url = new URL(`http://localhost:3333/events/9e9bd979-9d10-4915-b339-3786b1634f33/attendees?pageIndex=${page - 1}`)
    
    url.searchParams.set('pageIndex', String(page - 1))
    if(search.length > 1){
      url.searchParams.set('query', search)
    }
    fetch(url)
    .then(response => response.json())
    .then(data => {
      console.log(data)
      setAttendees(data.attendees)
      setTotal(data.total)
    })
  }, [page, search]);

 

  function setCurrentPage(page: number) {
    const url = new URL(window.location.toString())
    url.searchParams.set('page', String(page))
  
    window.history.pushState({}, "", url)

    setPage(page)
  }

  function setCurrentSearch(search: string) {
    const url = new URL(window.location.toString())
    url.searchParams.set('search', search)
  
    window.history.pushState({}, "", url)

    setSearch(search)
  }


  function goToNextPage(){
    return setCurrentPage(page + 1)
   }

  function goToPastPage(){
    return setCurrentPage(page - 1)
  }

  function goToLastPage(){
    return setCurrentPage(total)
  }

  function goToFirstPage(){
    return setCurrentPage(1)
  }

  function onSearchInputChanged(event: ChangeEvent<HTMLInputElement>){
    setCurrentSearch(event.target.value)
    setCurrentPage(1)
  }
  
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-3 items-center">
        <h1 className="text-2xl font-bold">Participantes</h1>
        <div className="px-3 w-72 py-4 border border-white/10 rounded-lg text-sm flex items-center gap-3" >
          <Search className="size-4 text-emerald-300"/>
          <input onChange={onSearchInputChanged} 
          placeholder="Buscar Participante..." 
          value={search}
          className="bg-transparent flex-1 outline-none border-0 p-0 text-sm focus-ring:0"  />
        </div>

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
          {attendees.map((attendee)=> {
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
                <TableCell>
                  {
                  attendee.checkedInAt === null ? 
                  <span className="text-zinc-400">Não fez check-in</span> : 
                  dayjs().to(attendee.checkedInAt) 
                  }
                </TableCell>
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
            <TableCell colSpan={3} >Mostrando {page} de {total} itens</TableCell>
            
            <TableCell colSpan={3} className="text-right"> 
              <div className="inline-flex flex items-center gap-8">
                <span>Pagina {page} de {total}</span> 
                <div className="flex gap-1.5">
                <IconButton onClick={goToFirstPage} disabled={page==1}>
                  <ChevronsLeft className="size-4"/>
                </IconButton>

                <IconButton onClick={goToPastPage} disabled={page==1}>
                  <ChevronLeft className="size-4"/>
                </IconButton>

                <IconButton onClick={goToNextPage} disabled={page==total}>
                  <ChevronRight className="size-4"/>
                </IconButton>

                <IconButton onClick={goToLastPage} disabled={page==total}>
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