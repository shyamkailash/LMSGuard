from dataclasses import dataclass


@dataclass(frozen=True)
class AIResult:
    name: str
    status: str
    confidence: float | None = None
    message: str = "Service not implemented."


class AIService:
    name = "ai_service"

    def analyze(self, *_: object, **__: object) -> AIResult:
        return AIResult(name=self.name, status="placeholder")
