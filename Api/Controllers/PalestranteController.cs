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
    public class PalestranteController : ControllerBase
    {
        private readonly IPalestrante _palestranteRepository;
        private readonly IMapper _mapper;

        public PalestranteController(IPalestrante palestranteRepository, IMapper mapper)
        {
            _palestranteRepository = palestranteRepository;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult> Get() 
        {
            try
            {
                var palestrantes = await _palestranteRepository.GetAllPalestrantesAsync(true);
                var results = _mapper.Map<PalestranteDTO[]>(palestrantes);
                return Ok(results);
            }
            catch (System.Exception ex)
            {
                return this.StatusCode(500, $"Deu ruim! {ex.Message}");
            }
        }

        [HttpGet("getPalestranteById/{id}")]
        public async Task<ActionResult> GetPalestranteById(int id)
        {
            try
            {
                var palestrante = await _palestranteRepository.GetPalestranteAsyncById(id);
                var result = _mapper.Map<PalestranteDTO>(palestrante);
                return Ok(result);
            }
            catch (System.Exception ex)
            {
                return this.StatusCode(500, $"Deu ruim! {ex.Message}");
            }
        }

        [HttpGet("getPalestranteByNome/{nome}")]
        public async Task<ActionResult> GetPalestranteByNome(string nome)
        {
            try
            {
                var palestrantes = await _palestranteRepository.GetPalestranteAsyncByNome(nome);
                var result = _mapper.Map<PalestranteDTO[]>(palestrantes);
                return Ok(result);
            }
            catch (System.Exception ex)
            {
                return this.StatusCode(500, $"Deu ruim! {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<ActionResult> Post(PalestranteDTO palestranteDTO)
        {
            try
            {
                var palestrante = _mapper.Map<Palestrante>(palestranteDTO);
                _palestranteRepository.Add(palestrante);

                if (await _palestranteRepository.SaveChangesAsync())
                {
                    return Ok(_mapper.Map<PalestranteDTO>(palestrante));
                }
            }
            catch (System.Exception ex)
            {
                return this.StatusCode(500, $"Deu ruim! {ex.Message}");
            }

            return BadRequest();
        }

        [HttpPut("{Id}")]
        public async Task<ActionResult> Put(int id, PalestranteDTO palestranteDTO)
        {
            try
            {
                var palestrante = await _palestranteRepository.GetPalestranteAsyncById(id, false);
                if (palestrante == null)
                {
                    return NotFound();
                }

                var idRedes = new List<int>();
                palestranteDTO.Redes.ForEach(item => idRedes.Add(item.Id));

                var redes = palestrante.Redes.Where(rede => !idRedes.Contains(rede.Id)).ToArray();

                if (redes.Length > 0) {
                    _palestranteRepository.DeleteRanger(redes);
                }

                palestranteDTO.Id = id;
                _mapper.Map(palestranteDTO, palestrante);
                _palestranteRepository.Update(palestrante);

                if (await _palestranteRepository.SaveChangesAsync())
                {
                    return Ok(_mapper.Map<PalestranteDTO>(palestrante));
                }
            }
            catch (System.Exception ex)
            {
                return this.StatusCode(500, $"Deu ruim! {ex.Message}");
            }

            return BadRequest();
        }

        [HttpDelete("{Id}")]
        public async Task<ActionResult> Delete(int Id)
        {
            try
            {
                var palestrante = await _palestranteRepository.GetPalestranteAsyncById(Id, false);
                if (palestrante == null)
                {
                    return NotFound();
                }

                _palestranteRepository.Delete(palestrante);
                if (await _palestranteRepository.SaveChangesAsync())
                {
                    return Ok(new { success = "Excluído com sucesso!" });
                }
            }
            catch (System.Exception)
            {
                return this.StatusCode(500, "Deu ruim!");
            }

            return BadRequest();
        }

        [HttpPost("upload")]
        public ActionResult Upload()
        {
            try
            {
                var file = Request.Form.Files[0];
                var folderName = Path.Combine("Resources", "Images");
                var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
                
                if (file.Length > 0) 
                {
                    var filename = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName;
                    var fullPath = Path.Combine(pathToSave, filename.Replace("\"", " ").Trim());

                    using(var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        file.CopyTo(stream);
                    }
                }

                return Ok(new { success = "Upload feito com sucesso!" });
            }
            catch (System.Exception ex)
            {
                return this.StatusCode(500, $"Deu ruim! {ex.Message}");
            }
        }
    }
}