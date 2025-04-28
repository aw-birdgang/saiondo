import unittest
from langchain_pipeline import run_pipeline

class TestLangchainPipeline(unittest.TestCase):
    def test_run_pipeline(self):
        prompt = "테스트 프롬프트"
        result = run_pipeline(prompt)
        self.assertIn("분석 결과", result)

if __name__ == "__main__":
    unittest.main() 