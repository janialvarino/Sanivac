const DatosMadre = require('../models/datosMadreModel');

exports.listar = async (req, res) => {
  try {
    const data = await DatosMadre.getAll();
    res.json(data);
  } catch (error) {
    console.error('❌ Error al listar datos de la madre:', error);
    res.status(500).json({ error: 'Error al listar datos de la madre' });
  }
};

exports.obtener = async (req, res) => {
  try {
    const data = await DatosMadre.getById(req.params.id);
    if (!data) return res.status(404).json({ message: 'No encontrado' });
    res.json(data);
  } catch (error) {
    console.error('❌ Error al obtener datos de la madre:', error);
    res.status(500).json({ error: 'Error al obtener datos de la madre' });
  }
};

exports.crear = async (req, res) => {
  try {
    const result = await DatosMadre.create(req.body);
    res.json({ message: '✅ Datos de la madre guardados con éxito', id: result.insertId });
  } catch (error) {
    console.error('❌ Error al crear datos de la madre:', error);
    res.status(500).json({ error: 'Error al crear datos de la madre' });
  }
};

exports.actualizar = async (req, res) => {
  try {
    await DatosMadre.update(req.params.id, req.body);
    res.json({ message: 'Actualizado' });
  } catch (error) {
    console.error('❌ Error al actualizar datos de la madre:', error);
    res.status(500).json({ error: 'Error al actualizar datos de la madre' });
  }
};

exports.eliminar = async (req, res) => {
  try {
    await DatosMadre.remove(req.params.id);
    res.json({ message: 'Eliminado' });
  } catch (error) {
    console.error('❌ Error al eliminar datos de la madre:', error);
    res.status(500).json({ error: 'Error al eliminar datos de la madre' });
  }
};