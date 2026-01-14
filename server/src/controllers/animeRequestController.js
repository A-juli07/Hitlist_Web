import AnimeRequest from '../models/AnimeRequest.js';

export const createAnimeRequest = async (req, res) => {
  try {
    const { animeName, userEmail, userName } = req.body;

    if (!animeName || !animeName.trim()) {
      return res.status(400).json({ message: 'Nome do anime é obrigatório' });
    }

    const requestData = {
      animeName: animeName.trim(),
      userEmail,
      userName
    };

    // Se o usuário estiver autenticado, adiciona o ID
    if (req.user) {
      requestData.requestedBy = req.user._id;
    }

    const animeRequest = await AnimeRequest.create(requestData);
    res.status(201).json({
      message: 'Solicitação enviada com sucesso! O administrador será notificado.',
      request: animeRequest
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao enviar solicitação', error: error.message });
  }
};

export const getAnimeRequests = async (req, res) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};

    const requests = await AnimeRequest.find(query)
      .populate('requestedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar solicitações', error: error.message });
  }
};

export const updateAnimeRequestStatus = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;

    const request = await AnimeRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Solicitação não encontrada' });
    }

    if (status) request.status = status;
    if (adminNotes) request.adminNotes = adminNotes;

    await request.save();
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar solicitação', error: error.message });
  }
};

export const deleteAnimeRequest = async (req, res) => {
  try {
    const request = await AnimeRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Solicitação não encontrada' });
    }

    await request.deleteOne();
    res.json({ message: 'Solicitação deletada com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar solicitação', error: error.message });
  }
};
