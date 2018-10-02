import unittest
from selenium import webdriver
from selenium.webdriver.common.keys import Keys


def children(element):
    return element.find_elements_by_xpath("*")


class WebTestCase(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.driver = webdriver.Chrome()

    @classmethod
    def tearDownClass(cls):
        cls.driver.close()

    def setUp(self):
        self.driver.get("http://localhost:8000")
        self.input = self.driver.find_element_by_css_selector("#input-text")
        self.publish = self.driver.find_element_by_css_selector("#btn-publish")
        self.messages = self.driver.find_element_by_css_selector(
            ".message-container")
        self.errors = self.driver.find_element_by_css_selector(
            ".error-container")

    def test_publish_message(self):
        _text = "hello"
        self.input.send_keys(_text)
        self.publish.click()
        self.assertEqual(len(children(self.errors)), 0)
        self.assertEqual(len(children(self.messages)), 1)

        published = self.messages.find_element_by_css_selector(
            ".message-div > p")
        self.assertEqual(_text, published.text)

    def test_publish_message_publishes_in_chronological_order(self):
        first = "first"
        self.input.send_keys(first)
        self.publish.click()

        second = "second"
        self.input.send_keys(second)
        self.publish.click()

        published = children(self.messages)
        self.assertEqual(len(published), 2)
        self.assertEqual(
            published[0].find_element_by_css_selector("p").text, second)
        self.assertEqual(
            published[1].find_element_by_css_selector("p").text, first)

    def test_publish_when_message_empty(self):
        self.publish.click()
        self.assertEqual(len(children(self.messages)), 0)
        self.assertEqual(len(children(self.errors)), 1)

    def test_publish_when_message_exceeds_140(self):
        self.input.send_keys("A" * 141)
        self.publish.click()
        self.assertEqual(len(children(self.messages)), 0)
        self.assertEqual(len(children(self.errors)), 1)

    def test_checkbox_marks_message_read(self):
        message = "hello"
        self.input.send_keys(message)
        self.publish.click()

        published = children(self.messages)[0]
        self.assertIn("unread", published.get_attribute("class"))

        checkbox = published.find_element_by_css_selector("input")
        checkbox.click()
        self.assertNotIn("unread", published.get_attribute("class"))

    def test_messages_disappear_on_reload(self):
        message = "hello"
        self.input.send_keys(message)
        self.publish.click()

        self.assertEqual(len(children(self.messages)), 1)
        self.driver.refresh()

        self.messages = self.driver.find_element_by_css_selector(
            ".message-container")
        self.assertEqual(len(children(self.messages)), 0)
