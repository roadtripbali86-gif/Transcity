
from kivy.app import App
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.image import AsyncImage
from kivy.uix.scrollview import ScrollView
from kivy.uix.label import Label
from kivy.metrics import dp
from kivy.core.window import Window

Window.clearcolor = (1, 1, 1, 1)  # Background putih

class HomeScreen(BoxLayout):
    def __init__(self, **kwargs):
        super().__init__(orientation='vertical', **kwargs)

        # ===== BANNER =====
        # Menggunakan pemandangan Bali (Pura) untuk menghindari visual mobil
        banner = AsyncImage(
            source='https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=1200',
            size_hint=(1, None),
            height=dp(250),
            allow_stretch=True,
            keep_ratio=False
        )

        self.add_widget(banner)

        # ===== CONTENT BAWAH =====
        content = ScrollView(size_hint=(1, 1))
        content_layout = BoxLayout(
            orientation='vertical',
            padding=dp(15),
            spacing=dp(10),
            size_hint_y=None
        )
        content_layout.bind(minimum_height=content_layout.setter('height'))

        content_layout.add_widget(Label(
            text="Selamat Datang di Transcity Bali",
            size_hint_y=None,
            height=dp(40),
            font_size='18sp',
            bold=True,
            color=(0, 0, 0, 1)
        ))

        content_layout.add_widget(Label(
            text="Pesan tiket Singaraja - Denpasar lebih cepat dan praktis melalui aplikasi.",
            size_hint_y=None,
            height=dp(60),
            font_size='14sp',
            color=(0.2, 0.2, 0.2, 1)
        ))

        content.add_widget(content_layout)
        self.add_widget(content)


class TranscityApp(App):
    def build(self):
        return HomeScreen()


if __name__ == "__main__":
    TranscityApp().run()
