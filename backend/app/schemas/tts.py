from dotenv import load_dotenv
load_dotenv()

import os
import base64
from sarvamai import SarvamAI

_sarvam_client = SarvamAI(api_subscription_key=os.getenv("SARVAM_API_KEY"))

# Sarvam is used only for Kannada.
SARVAM_LANGUAGE_CODE = "kn-IN"
DEFAULT_SPEAKER = os.getenv("SARVAM_TTS_SPEAKER", "shubh")


def synthesize_speech(text: str, language: str = "en") -> dict:
    """
    Routes TTS by language:
      - kn -> Sarvam AI Bulbul v3
      - en -> default/non-Sarvam provider
    """
    if language == "kn":
        return _synthesize_with_sarvam(text)
    else:
        return _synthesize_with_default(text, language)


def _synthesize_with_sarvam(text: str) -> dict:
    response = _sarvam_client.text_to_speech.convert(
        model="bulbul:v3",
        text=text,
        target_language_code=SARVAM_LANGUAGE_CODE,
        speaker=DEFAULT_SPEAKER,
    )

    audios = getattr(response, "audios", None)
    if audios is None and isinstance(response, dict):
        audios = response.get("audios")

    if not audios:
        raise RuntimeError("Sarvam TTS returned no audio")

    return {
        "audio_base64": audios[0],
        "format": "wav",
        "language": "kn",
    }


def _synthesize_with_default(text: str, language: str) -> dict:
    # TODO: plug in whatever your existing English TTS provider is
    # (e.g. ElevenLabs, Azure, browser-native SpeechSynthesis, etc.)
    raise NotImplementedError("Wire up the non-Sarvam English TTS provider here")