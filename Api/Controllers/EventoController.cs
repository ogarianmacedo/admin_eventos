using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Api.DTO;
using Api.Interfaces;
using Api.Models;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventoController : ControllerBase
    {
        private readonly IEvento _eventoRepository;
        private readonly IMapper _mapper;

        public EventoController(IEvento repositorio, IMapper mapper)
        {
            _eventoRepository = repositorio;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult> Get()
        {
            try
            {
                var eventos = await _eventoRepository.GetAllEventoAsync(true);
                var results = _mapper.Map<EventoDTO[]>(eventos);
                return Ok(results);
            }
            catch (System.Exception ex)
            {
                return this.StatusCode(500, $"Deu ruim! {ex.Message}");
            }
        }

        [HttpPost("upload")]
        public ActionResult Upload()
        {
            try
            {
                var file = Request.Form.Files[0];
                var folderName = Path.Combine("Resources", "Images");
                var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
                
                if(file.Length > 0) 
                {
                    var filename = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName;
                    var fullPath = Path.Combine(pathToSave, filename.Replace("\"", " ").Trim());

                    using(var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        file.CopyTo(stream);
                    }
                }

                return Ok();
            }
            catch (System.Exception ex)
            {
                return this.StatusCode(500, $"Deu ruim! {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> Get(int id)
        {
            try
            {
                var evento = await _eventoRepository.GetEventoAsyncById(id, true);
                var results = _mapper.Map<EventoDTO>(evento);
                return Ok(results);
            }
            catch (System.Exception)
            {
                return this.StatusCode(500, "Deu ruim!");
            }
        }

        [HttpGet("getByTema/{tema}")]
        public async Task<ActionResult> Get(string tema)
        {
            try
            {
                var eventos = await _eventoRepository.GetEventoAsyncByTema(tema, true);
                 var results = _mapper.Map<EventoDTO[]>(eventos);
                return Ok(results);
            }
            catch (System.Exception)
            {
                return this.StatusCode(500, "Deu ruim!");
            }
        }

        [HttpPost]
        public async Task<ActionResult> Post(EventoDTO model)
        {
            try
            {
                var evento = _mapper.Map<Evento>(model);
                _eventoRepository.Add(evento);
                if (await _eventoRepository.SaveChangesAsync())
                {
                    return Created($"/api/evento/{model.Id}", _mapper.Map<EventoDTO>(evento));
                }
            }
            catch (System.Exception ex)
            {
                return this.StatusCode(500, $"Deu ruim! {ex.Message}");
            }

            return BadRequest();
        }

        [HttpPut("{Id}")]
        public async Task<ActionResult> Put(int Id, EventoDTO model)
        {
            try
            {
                var evento = await _eventoRepository.GetEventoAsyncById(Id, false);
                if (evento == null)
                {
                    return NotFound();
                }

                var idLotes = new List<int>();
                var idRedes = new List<int>();

                model.Lotes.ForEach(item => idLotes.Add(item.Id));
                model.Redes.ForEach(item => idRedes.Add(item.Id));

                var lotes = evento.Lotes.Where(lote => !idLotes.Contains(lote.Id)).ToArray();
                var redes = evento.Redes.Where(rede => !idRedes.Contains(rede.Id)).ToArray();

                if (lotes.Length > 0) {
                    _eventoRepository.DeleteRanger(lotes);
                }

                 if (redes.Length > 0) {
                    _eventoRepository.DeleteRanger(redes);
                }

                _mapper.Map(model, evento);
                _eventoRepository.Update(evento);

                if (await _eventoRepository.SaveChangesAsync())
                {
                    return Created($"/api/evento/{model.Id}", _mapper.Map<EventoDTO>(evento));
                }
            }
            catch (System.Exception)
            {
                return this.StatusCode(500, "Deu ruim!");
            }

            return BadRequest();
        }

        [HttpDelete("{Id}")]
        public async Task<ActionResult> Delete(int Id)
        {
            try
            {
                var evento = await _eventoRepository.GetEventoAsyncById(Id, false);
                if (evento == null)
                {
                    return NotFound();
                }

                _eventoRepository.Delete(evento);
                if (await _eventoRepository.SaveChangesAsync())
                {
                    return Ok();
                }
            }
            catch (System.Exception)
            {
                return this.StatusCode(500, "Deu ruim!");
            }

            return BadRequest();
        }
    }
}